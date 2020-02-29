[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/paripsky/relier)

relier is an app that allows you to control a remote machine from chrome or from a desktop app.

Usage
-----
1. download the relier app or navigate to the relier web app.
2. enter a secret, then enter the same secret in the remote machine.
3. connect to that remote machine & remotely control it.

Building
-----
```
npm run build
```

Tech Stack
----
- the relier web app is written in Typescript using React & Redux. 
- the relier desktop app is built using electron.
- the server is a Node.js websockets server written in Typescript.

Custom Signaling Server
-----
- host your own insance of relier-server.

or

- implement the same WebSocket api as relier-server with custom extensions.

then select that signaling server in the app's settings.

Custom Turn Server
-----
you can select a different turn server in the app's settings, the selected server will be saved in the localStorage.

License
---
MIT