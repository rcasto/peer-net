var http = require('http');
var app = require('./lib/app');
var socketServerGenerator = require('./lib/socketServerGenerator');

var port = process.env.port || 3000;
var server = http.createServer(app);
var socketServer = socketServerGenerator({
    clientTracking: true,
    server
});

server.listen(port, () => console.log(`Server started on port ${port}`));