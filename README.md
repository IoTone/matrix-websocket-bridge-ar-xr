# A little website chat tool that speaks into a Matrix channel

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
 
## Snap Spectacles UX

Compatible with Spectacles 24.  See subfolder.  It will leverage the JS library mentioned in the previous section, and will port it for snap spectacles.  The spectacles version of this example is intended as a prototype to demonstrate alteratnives for decentralized messaging. The fact we can communicate with a room, we can ask a real person to reply, or we can build an interesting set of distributed AI / bot applications.
 
## XR UX

Leverage ThreeJS WebXR.  It lives in the XR subdirectory and should be compatible with Quest 3, AVP, Frame, or Spectacles.  In the future, everything will have an XR type interface.  Count on that.

TODO

## TUI

There will exist a TUI that can either be run on its own, or via XR (inside of a webview component).  The TUI will allow you to adjust the settings for the server mentioned earlier in the README.  These env settings should be updatable at runtime instead of being something that can only be touched on a remote server SSH.

TODO

## Attributions
Written by SvenK, code licensed as CC0
XR/AR portions by IoTone, Inc.
