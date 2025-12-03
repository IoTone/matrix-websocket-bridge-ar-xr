# Overview 

This is a simple Matrix Client (not full featured) using a proxy to enable easy access to a configured matrix account/room and home server.  Intent is to build XR powered Clients for visual and also audio interfaces.  Hands-free communication may be explored down the road (voice or non-keyboard input)

This project is an improper fork of https://github.com/svenk/matrix-websocket-bridge.  Because git-lfs was needed on the fork, it was not possible to push to a fork with git-lfs turned on.  Ridiculous.

[![Watch an example on youtube](https://private-user-images.githubusercontent.com/64202/521673324-3c8235a9-d1b9-4219-a762-e5de084594e7.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjQ3NDY1MjQsIm5iZiI6MTc2NDc0NjIyNCwicGF0aCI6Ii82NDIwMi81MjE2NzMzMjQtM2M4MjM1YTktZDFiOS00MjE5LWE3NjItZTVkZTA4NDU5NGU3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTEyMDMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUxMjAzVDA3MTcwNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPThjN2RlZDcyZjc1MGMxYmFmYTUyMzE2Y2IzMTM4Y2M5NTAzMzUzZWZmODBmM2E1NTQ2MjczZThjMDQ1YzExYWUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.kq5DI5b-vU-2t8LpYhlj8wlHUF-_4PZEZ_d9KBPZJQ0)](https://www.youtube.com/shorts/9BEVOT5upE8)

## Goals

- Build futuristic clients for AR interfaces
- explore new styles of communication

## Status

- (DONE) Spectacles 24 Lens able to receive messages, text keyboard input supported, needs work on "receive" interface, remove debugging 
- (TODO) Generalized XR interface (testing on Quest 3S and Spectacls) has not yet started but is planned
- (DONE) Go WebSocket proxy for matrix (insecure room) is functional and stable

## Thought Experiments

- TODO:  Livestream computer vision object classification, scene based prompt generation (what am I looking at?), and event based alerts (see fire, detect emergency) and send to matrix channel
- TODO:  Full room and 1-1 chat support with arbitrary space for communication
- TODO:  Alternative input methods: gestures or  grafitti style text input
- TODO:  Voice to Text input
- TODO:  Audio Transcription of incoming messages
- TODO: full feature client without proxy 
 
## Original Overview

 A little website chat tool that speaks into a Matrix channel

This repo provides a small, near-to-trivial websocket-to-matrix
bridge. That is, the golang code is both a websocket server
(speaking a simple json lines protocol) and a matrix client.

The idea is that a website user can use typical "chat widget"
to immediately start chatting within a matrix channel, without
prior authorization. Similar tools are widespared used in sales,
typically with AI agents and so on.

Compared to this, the idea here is to simplify the spontaneous
communication between website visitor and hoster. Matrix is
just a suitable protocol, any other would also do it.

In order to use this, you should set up a shell script like this:

```
#!/bin/bash
export MATRIX_HOMESERVER="https://matrix-client.matrix.org"
export MATRIX_USER="@your-bot-user-account:matrix.org"
export MATRIX_TOKEN="this is secret"
export TARGET_ROOM="!whateversecretid:matrix.org"
export ALLOWED_SENDER="@your-agent-user:matrix.org"
go run .
```

Note: ALLOWED_SENDER is optional.

Generate the long living login token with such a script:

```
#!/bin/bash

# $base_url from https://matrix.org/.well-known/matrix/client
base_url="https://matrix-client.matrix.org"

username="@your-bot-user-account:matrix.org"
password="your super secret login password"

curl -X POST -H "Content-Type: application/json" \
    -d '{"type":"m.login.password", "user":"'$username'", "password":"'$password'"}' \
    "$base_url/_matrix/client/v3/login"
    
# this emits a login token, copy to MATRIX_TOKEN
```

The repo also ships with a small index.html demonstrator code.
Since you cannot open websockets from `file://` hosting, you need
to access this file in your browser served by a webserver, for 
instance by spawning a python-included webserver with
`python3 -m http.server 8000`.

Note that the golang server upgrades any connection attempt at 
any URL path to a websocket because it is intended to be used within
some revproxy setting. Head over to
https://github.com/svenk/www-svenk.org/tree/main/src/chat 
to see how I am using this on my website found here: https://www.svenk.org/chat/.

## JS Library

As mentioned above, the original source example is here: 
	https://github.com/svenk/www-svenk.org/tree/main/src/chat 

The client code "client.js" has been incorporated into this repo in the subdirectory lib.  

This library is provided from the above sorce for historical purposes, but isn't a general purpose client library but specifically designed to run on the web page "index.html" example provided.  

A generic library called matrixeyeclient.js will be provided under the LIB directory.  TODO  

## Snap Spectacles UX

Compatible with Spectacles 24.  See subfolder.  It will leverage the ideas from the JS library mentioned in the previous section, and will port it for snap spectacles.  The spectacles version of this example is intended as a prototype to demonstrate alteratnives for decentralized messaging. The fact we can communicate with a room, we can ask a real person to reply, or we can build an interesting set of distributed AI / bot applications.
 
## XR UX

Leverage ThreeJS WebXR.  It lives in the XR subdirectory and should be compatible with Quest 3, AVP, Frame, or Spectacles.  In the future, everything will have an XR type interface.  Count on that.

TODO

## TUI

There will exist a TUI that can either be run on its own, or via XR (inside of a webview component).  The TUI will allow you to adjust the settings for the server mentioned earlier in the README.  These env settings should be updatable at runtime instead of being something that can only be touched on a remote server SSH.

TODO

## Attributions

Written by SvenK, code licensed as CC0
XR/AR portions by IoTone, Inc.
