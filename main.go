package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sync"
	"strings"
	"net"

	"github.com/charmbracelet/log"
	"github.com/gorilla/websocket"
	"maunium.net/go/mautrix"
	"maunium.net/go/mautrix/event"
	"maunium.net/go/mautrix/id"
)

var (
	// Map: thread root event ID -> websocket connection
	threadConns   = map[id.EventID]*websocket.Conn{}
	threadConnsMu sync.RWMutex

	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true }, // add auth in production
	}
)

type WebSocketMessage struct {
	Nickname string `json:"nickname"`
	Message  string `json:"msg"`
}

func main() {
	log.Info("This is a little website websocket to matrix bot.")

	hs := mustEnv("MATRIX_HOMESERVER") // e.g. https://matrix-client.matrix.org
	user := mustEnv("MATRIX_USER")     // should match token user; verified via Whoami below
	token := mustEnv("MATRIX_TOKEN")
	target := mustEnv("TARGET_ROOM") // e.g. #myroom:matrix.org or !roomid:matrix.org
	listen := getEnvOr("LISTEN_PORT", "127.0.0.1:18081")
	allowedSender := os.Getenv("ALLOWED_SENDER") // optional: restrict who can talk back

	log.Infof("Connecting to %s as %s ...", hs, user)

	cli, err := mautrix.NewClient(hs, id.UserID(user), token)
	if err != nil {
		log.Fatalf("matrix client: %v", err)
	}

	ctx := context.Background()

	// Make sure cli.UserID aligns with the token (avoids M_FORBIDDEN on /filter)
	if who, err := cli.Whoami(ctx); err == nil && cli.UserID != who.UserID {
		log.Warnf("MATRIX_USER (%s) != token user (%s); correcting", cli.UserID, who.UserID)
		cli.UserID = who.UserID
	}

	roomID, err := ensureJoinRoom(ctx, cli, target)
	if err != nil {
		log.Fatalf("join room: %v", err)
	}
	//log.Infof("posting to room %s", roomID)

	// Note: "/" matches all paths, i.e. any URL
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			http.Error(w, "WS2Matrix bridge: Please use proper WS client", http.StatusBadRequest)
			//log.Infof("ws upgrade: %v", err)
			return
		}
		defer ws.Close()

		threadHasBeenOpened := false
		var rootID id.EventID

		for {
			_, data_raw, err := ws.ReadMessage()
			if err != nil {
				// log.Printf("ws read: %v", err) // typically just some connection closed
				break
			}
			var data WebSocketMessage
			err = json.Unmarshal(data_raw, &data)
			if err != nil {
				log.Infof("ws input is not json: %v", err)
				break
			}

			if data.Message == "" {
				continue // skip empty messages
			}

			if !threadHasBeenOpened {
				// Create exactly ONE root message for this connection
				rootID, err = startThread(ctx, cli, roomID,
					fmt.Sprintf("🔌 New chat from %s, Referer: %s. User Agent: %s", realIP(r), r.Referer(), r.UserAgent()))
				if err != nil {
					log.Infof("send root: %v", err)
					return
				}
				// Map this thread to this ws connection
				threadConnsMu.Lock()
				threadConns[rootID] = ws
				threadConnsMu.Unlock()
				//log.Printf("Opened new thread %s", rootID)
				threadHasBeenOpened = true
			}

			line := data.Message
			if data.Nickname != "" {
				line = fmt.Sprintf("<%s> %s", data.Nickname, data.Message)
			}

			if err := sendThreadText(ctx, cli, roomID, rootID, line, false); err != nil {
				log.Warnf("send thread text: %v", err)
			}
		}

		// cleanup: drop this thread mapping when ws closes
		if threadHasBeenOpened {
			line := ">>> client quitted: end of chat <<<"
			if err := sendThreadText(ctx, cli, roomID, rootID, line, true); err != nil {
				log.Warnf("send thread text: %v", err)
			}
		}

		threadConnsMu.Lock()
		delete(threadConns, rootID)
		threadConnsMu.Unlock()
	})

	// Matrix <- replies (threaded or classic direct reply to root) -> forward to the right socket
	syncer := cli.Syncer.(*mautrix.DefaultSyncer)
	syncer.OnEventType(event.EventMessage, func(_ context.Context, ev *event.Event) {
		// Only events from our target room
		if ev.RoomID != roomID {
			return
		}
		// Optional: only accept from a specific sender (e.g., you)
		if allowedSender != "" && ev.Sender.String() != allowedSender {
			return
		}

		// drop my own messages
		if ev.Sender.String() == user {
			return
		}

		// Determine which session root this message belongs to
		key := threadKeyFrom(ev.Content.Raw) // prefers proper m.thread; falls back to direct reply to root
		if key == "" {
			return
		}

		msg := ev.Content.AsMessage()
		if msg == nil || msg.Body == "" {
			return
		}

		threadConnsMu.RLock()
		ws := threadConns[key]
		threadConnsMu.RUnlock()
		if ws == nil {
			return
		}

		data := WebSocketMessage{ev.Sender.Localpart(), msg.Body}
		data_raw, err := json.Marshal(data)
		if err != nil {
			log.Warnf("marshalling %v failed: %v", data, err)
			return
		}

		_ = ws.WriteMessage(websocket.TextMessage, data_raw)
	})

	// start http + sync
	go func() {
		log.Infof("Starting websocket server at ws://%s", listen)
		log.Fatal(http.ListenAndServe(listen, nil))
	}()

	//log.Println("syncing…")
	if err := cli.Sync(); err != nil {
		log.Fatalf("sync: %v", err)
	}
}

func realIP(r *http.Request) string {
    if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
        // X-Forwarded-For can be a comma-separated list of IPs
        parts := strings.Split(xff, ",")
        return strings.TrimSpace(parts[0]) // left-most = original client
    }

    host, _, err := net.SplitHostPort(r.RemoteAddr)
    if err != nil {
        return r.RemoteAddr
    }
    return host
}


func mustEnv(k string) string {
	v := os.Getenv(k)
	if v == "" {
		log.Fatalf("missing env %s", k)
	}
	return v
}

func getEnvOr(k string, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

// ensureJoinRoom works with either a room alias (e.g. #room:server) or a room ID (!abc:server).
func ensureJoinRoom(ctx context.Context, cli *mautrix.Client, roomIDOrAlias string) (id.RoomID, error) {
	res, err := cli.JoinRoom(ctx, roomIDOrAlias, &mautrix.ReqJoinRoom{
		// ServerName: []string{"matrix.org"}, // optional: help federation resolve
	})
	if err != nil {
		return "", err
	}
	return res.RoomID, nil
}

func startThread(ctx context.Context, cli *mautrix.Client, room id.RoomID, text string) (id.EventID, error) {
	content := &event.MessageEventContent{MsgType: event.MsgText, Body: text}
	resp, err := cli.SendMessageEvent(ctx, room, event.EventMessage, content)
	if err != nil {
		return "", err
	}
	return resp.EventID, nil
}

// sendThreadText posts a message as a reply INSIDE the thread with the given rootID.
// Uses proper Matrix threads (m.thread), and includes m.in_reply_to for fallback-only clients.
func sendThreadText(ctx context.Context, cli *mautrix.Client, room id.RoomID, rootID id.EventID, text string, silent bool) error {
	msgType := event.MsgText
	if silent {
		msgType = event.MsgNotice
	}

	content := &event.MessageEventContent{
		MsgType: msgType,
		Body:    text,
		RelatesTo: &event.RelatesTo{
			Type:    "m.thread", // relation type
			EventID: rootID,     // thread ROOT id
			//InReplyTo: &event.InReplyTo{EventID: rootID}, // fallback for older clients
		},
	}
	_, err := cli.SendMessageEvent(ctx, room, event.EventMessage, content)
	return err
}

func oneLine(s string) string {
	out := make([]rune, 0, len(s))
	for _, r := range s {
		if r == '\n' || r == '\r' {
			out = append(out, ' ')
		} else {
			out = append(out, r)
		}
	}
	return string(out)
}

// --- Thread routing helpers ---

// isKnownRoot checks if an event ID is a session root we created.
func isKnownRoot(eid id.EventID) bool {
	threadConnsMu.RLock()
	_, ok := threadConns[eid]
	threadConnsMu.RUnlock()
	return ok
}

// threadKeyFrom returns the session root event ID for a reply.
// Supports:
//
//	A) proper threads:  content["m.relates_to"].rel_type == "m.thread"
//	   -> use content["m.relates_to"].event_id as the root
//	B) classic reply fallback: content["m.relates_to"]["m.in_reply_to"].event_id
//	   -> if parent is one of our known roots, use that
func threadKeyFrom(raw map[string]interface{}) id.EventID {
	relRaw, ok := raw["m.relates_to"]
	if !ok {
		return ""
	}
	relMap, ok := relRaw.(map[string]interface{})
	if !ok {
		return ""
	}

	// A) Proper threaded reply (MSC3440): carries the ROOT event id
	if relType, _ := relMap["rel_type"].(string); relType == "m.thread" {
		if rootStr, _ := relMap["event_id"].(string); rootStr != "" {
			return id.EventID(rootStr)
		}
	}

	// B) Classic reply fallback: direct reply to a known root
	if inrep, _ := relMap["m.in_reply_to"].(map[string]interface{}); inrep != nil {
		if parentStr, _ := inrep["event_id"].(string); parentStr != "" {
			pid := id.EventID(parentStr)
			if isKnownRoot(pid) {
				return pid
			}
		}
	}
	return ""
}
