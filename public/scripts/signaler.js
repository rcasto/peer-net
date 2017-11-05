var Socket = (function () {
    var _isConnected = false;
    var ws = null;

    function connect() {
        var host = window.location.host;

        if (ws) {
            return ws;
        }

        ws = new WebSocket('ws://' + host);

        ws.addEventListener('open', function () {
            console.log('Connected');
            _isConnected = true;
        });
        ws.addEventListener('message', function (message) {
            console.log('Received message: ' + JSON.stringify(message.data));
        });
        ws.addEventListener('close', function () {
            console.log('Connection closed');
            cleanup();
        });
        ws.addEventListener('error', function (error) {
            console.error('Error with connection: ' + JSON.stringify(error));
            cleanup();
        });
    }

    function send(data) {
        if (!isConnected()) {
            console.error('Must first be connected via connect() call');
            return;
        }
        ws.send(JSON.stringify(data));
    }

    function isConnected() {
        return _isConnected;
    }

    function cleanup() {
        _isConnected = false;
        ws = null;
    }

    return {
        isConnected: isConnected,
        connect: connect,
        send: send
    };
}());