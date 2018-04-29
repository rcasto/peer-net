# peer-net
Goal: Connect peers without the need for a central server

Uses [WebRTC](https://www.w3.org/TR/webrtc/) to connect peers together, which in turn necessitates the concept of a ["signaling server"](http://www.webrtc-experiment.com/docs/WebRTC-Signaling-Concepts.html).  In our case it's currently just copy/paste and use your channel of choice to share the connection information.

## Getting Up & Running
### Prerequisites
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)

### Setup steps
1. Clone this repo: https://github.com/rcasto/peer-net/
2. Navigate to where you cloned the repo using the command line or tool of choice
3. Run the command `npm install`
4. Now run the command `npm start`
5. Navigate to http://localhost:3000
6. You're all set up!

## Current Limitations
- Must copy/paste and find outside channel to send offer/answer to other peer
- Only connects 1 peer to another peer, does not allow multiple connections building up a network
- Does not allow additional data exchange after initial connection