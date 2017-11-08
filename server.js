var http = require('http');
var app = require('./lib/app');
var SocketServer = require('./lib/socketServer');

var port = process.env.port || 3000;
var server = http.createServer(app);
var socketServer = new SocketServer({
    server
});

server.listen(port, () => console.log(`Server started on port ${port}`));