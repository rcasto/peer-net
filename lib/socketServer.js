var ws = require('ws');
var uuidv4 = require('uuid/v4');

function SocketServer(options) {
    this.clientMap = new Map();
    this.socketServer = new ws.Server(options);
    this.socketServer.on('listening', onListening.bind(this));
    this.socketServer.on('connection', onConnection.bind(this));
    this.socketServer.on('error', onError.bind(this));   
}

function onListening() {
    console.log('Socket server is now listening');
}

function onConnection(socket, req) {
    console.log('Client connected');
    this.clientMap.set(socket, uuidv4());
    socket.on('message', onSocketMessage.bind(this, socket));
    socket.on('error', onSocketError.bind(this, socket));
    socket.on('close', onSocketClose.bind(this, socket));
}

function onSocketMessage(socket, rawMessage) {
    console.log(`Received: ${rawMessage}`);

    var message = JSON.parse(rawMessage);

    if (message.desc) { // indicates SDP message
        if (message.desc.type === 'offer') {
            console.log('Offer received');
            this.clientMap.forEach((id, client) => {
                if (socket !== client) {
                    client.send(rawMessage);
                }
            });
        } else if (message.desc.type === 'answer') {
            console.log('Answer received');
        } else {
            console.error(`Invalid SDP message: ${rawMessage}`);
        }
    }
}

function onSocketClose(socket, code, reason) {
    this.clientMap.delete(socket);
    console.log(`Socket has been closed with code: ${code} and reason: ${reason}`);
}

function onSocketError(socket, error) {
    this.clientMap.delete(socket);
    onError(error);    
}

function onError(error) {
    console.error(`Error occurred: ${JSON.stringify(error)}`);
}

module.exports = SocketServer;