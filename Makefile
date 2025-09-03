GOOS    := linux
GOARCH  := amd64
GOFLAGS := -tags netgo -trimpath -ldflags="-s -w"

ws-chat-to-matrix:
	CGO_ENABLED=0 GOOS=$(GOOS) GOARCH=$(GOARCH) go build $(GOFLAGS)

release: ws-chat-to-matrix
	scp -Cr ws-chat-to-matrix *.sh svenk.org:/home/sven/www/svenk.org-chat/

.PHONY: ws-chat-to-matrix release
