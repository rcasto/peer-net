var express = require('express');
var path = require('path');
var ws = require('ws');
var http = require('http');

var port = process.env.port || 3000;
var app = express();
var server = http.createServer(app);
var socketServer = new ws.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

server.listen(port, () => console.log(`Server started on port ${port}`));

socketServer.on('connection', (socket, req) => {
    socket.on('message', message => {
        console.log(`Received: ${message}`);
    });
    socket.send('something');
});