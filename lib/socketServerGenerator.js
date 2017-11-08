var ws = require('ws');

function create(options) {
    var socketServer = new ws.Server(options);
    socketServer.on('listening', () => console.log('Socket server is now listening'));
    socketServer.on('connection', (socket, req) => {
        console.log('Client connected');
        socket.on('message', message => {
            console.log(`Received: ${message}`);
        });
        socket.send('something');
    });
    socketServer.on('error', 
        error => console.error(`Error occurred: ${JSON.stringify(error)}`));   
}

module.exports = create;