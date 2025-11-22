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

Written by SvenK, code licensed as CC0

