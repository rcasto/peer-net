var ws = require('ws');

function create(options) {
    var socketServer = new ws.Server(options);
    socketServer.on('listening', onListening);
    socketServer.on('connection', onConnection);
    socketServer.on('error', onError);   
}

function onListening() {
    console.log('Socket server is now listening');
}

function onConnection(socket, req) {
    console.log('Client connected');
    socket.on('message', message => {
        console.log(`Received: ${message}`);
    });
    socket.send('something');
}

function onError(error) {
    console.error(`Error occurred: ${JSON.stringify(error)}`);
}

module.exports = create;