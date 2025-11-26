import {EventEmitter} from "../utils/EventEmitter";
import type TypedEmitter from '../typed-emitter/TypedEmitter';
import type { Options } from './types/Options';
import {Interval} from "../utils/Intervals";

const defaultOpts = {
    timeout: 2000,
    initialReconnectDelay: 1000, // 1 sec
    maxReconnectDelay: 32000, // 32 sec
    uri: "ws://localhost:18081"
};

const bridge_url_relative = "/ws"; // "/chat/socket";
// bridge_url = new URL(bridge_url_relative, location.href);
// bridge_url.protocol = bridge_url.protocol === "https:" ? "wss:" : "ws:";

export interface MessageEvents {
    'disconnected': (err: string, errCode: number) => void
    'reconnecting': (status: string) => void
    'reconnected': (status: string) => void
    'ondata': (data: JSON) => void
    'connectionerror': (err: string, errCode: number) => void
}


/**
 * MQTT Client object
 */
// PORTING
export class MatrixEyeLib extends (EventEmitter as new () => TypedEmitter<MessageEvents>) {
    private uri: string;
    private scriptComp?: BaseScriptComponent;
    private reconnectTimer?: Interval;
    private opts: Partial<Options> = defaultOpts; // {};
    private internetModule: InternetModule = require("LensStudio:InternetModule");
    private webSocket?: WebSocket;
    private connected: boolean;
    private reconnecting: boolean = false;
    private autoReconnect: boolean;

    /**
     * constructor
     * @param url MQTT broker where the client should attempt a connection
     */
    constructor(options: Partial<Options> = {}, sceneObj: BaseScriptComponent) {
        super();
        this.scriptComp = sceneObj;
        this.opts = options;
        this.reconnectTimer = new Interval(this.scriptComp);
        this.connected = false;
        this.autoReconnect = true;
        this.uri = this.opts.uri + bridge_url_relative;
    }

    connect() {
        this.emit('reconnecting', 'starting connect' + this.uri);
        
        this.doConnect(this.opts.timeout);
    }


    private reconnect(): void {
        if (!this.autoReconnect) {
            return;
        }

        if (!this.connected) {
            this.emit('reconnecting', 'Trying to reconnect...' + this.uri);
            this.reconnecting = true;
            this.doConnect(this.opts.timeout);
        }
    }
    
    private doConnect(timeout: number) {
        try {
            // globalThis.textLogger.log("connecting: " + this.uri);
            print("connecting: " + this.uri);
            this.webSocket = this.internetModule.createWebSocket(this.uri);
            // XXX Need to convert handling of arraybuffer to blob            
            this.webSocket.binaryType = 'blob';

            // this.webSocket.onclose = (event: CloseEvent) => {
            this.webSocket.onclose = (event) => {
                let e: Error;
                e = new Error('Websocket closed normally we think');
                print("protocolhandler WebSocket.onclose");
                this.internalDisconnect(e);
            };

            // PORTING
            // this.webSocket.onerror = (error: Event) => {
            this.webSocket.onerror = (event: WebSocketEvent) => {
                globalThis.textLogger.log("protocolhandler WebSocket.onerror");                
                // this.connectingPromise?.reject(error);
                this.connected = false;
                this.emit("connectionerror", "protocolhandler WebSocket.onerror", 10)
            };
            
            // PORTING
            // this.webSocket.onmessage = (evt: MessageEvent) => {
            this.webSocket.onmessage = async (evt: WebSocketMessageEvent) => {
                print("protocolhandler WebSocket.onmessage");
                /*
                appendMessage(JSON.parse(String(evt.data)), "recv")
                notifyTitle()
                playPling()
                */
                if (evt.data instanceof Blob) {
                    // Binary frame, can be retrieved as either Uint8Array or string
                    const bytes = await evt.data.bytes();
                    const text = await evt.data.text();
                    // this.messageReceived(bytes);
                    // TODO: process message
                    globalThis.textLogger.log(text);
                } else {
                    // Binary frame, can be retrieved as either Uint8Array or string
                    const text = await evt.data; // It's text
                    // this.messageReceived(bytes);
                    // TODO: process message
                    globalThis.textLogger.log(text);
                }
            };

            this.webSocket.onopen = (event: WebSocketEvent) => {
                print("protocohandler WebSocket.onopen");
                this.emit("reconnected", "connected");
                // this.webSocket.send('{msg: "yo yo", nickname: "heymama" }');
                const jsonString = JSON.stringify({msg: "@Spectacles01 entered the room!", nickname: "Spectacles01" });
                this.webSocket.send(jsonString);
                // this.protocolConnect();
            };
        } catch(err) {
            // PORTING
            // clearTimeout(timer);
            // timer.cancelInterval();
            this.emit("connectionerror", err, 11);
        }
    }
    

    clearLocalState(): void {
        if (this.webSocket) {
            if (this.webSocket.readyState == 1) {
                // PORTING
                // this.webSocket.close(1000);
                this.webSocket.close();
            }
            /*
            this.webSocket.onopen = null;
            this.webSocket.onmessage = null;
            this.webSocket.onclose = null;
            this.webSocket.onerror = null;

            this.webSocket = undefined;
            */
        }
        // this.pinger.cancel();
        // delete this.remainingBuffer;
        // this.remainingBuffer = undefined;
        this.connected = false;
        
        // cancel the reconenct timer
        if (this.reconnectTimer) {
            // PORTING
            // clearTimeout(this.reconnectTimer);
            this.reconnectTimer.cancelInterval();
        }
    }

    
    internalDisconnect(e: Error): void | never {
        this.clearLocalState();
        this.emit('disconnected', 'Connection lost', 10);
        const nextRetryInterval = this.opts.maxReconnectDelay // TODO: implement backoffthis.backoff.next();
        // reconnect if needed
        // PORTING
        this.reconnectTimer.setTimeoutInSec(() => {
            this.reconnect();
        }, nextRetryInterval);
        globalThis.textLogger.log(`Connection failed with error ${e.message}, will retry after " + ${nextRetryInterval / 1000} + " secs`);
    }



    

}