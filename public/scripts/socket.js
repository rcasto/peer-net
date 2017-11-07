var Socket = (function () {
    var _isConnected = false;
    var ws = null;

    function connect(handle) {
        if (ws) {
            return Promise.resolve(ws);
        }
        return new Promise(function (resolve, reject) {
            var host = window.location.host;

            ws = new WebSocket('ws://' + host);
            ws.addEventListener('open', function () {
                onOpen();
                resolve(ws);
            });
            ws.addEventListener('close', onClose);
            ws.addEventListener('error', function (error) {
                onError(error);
                reject(error);
            });
    
            if (handle) {
                addMessageHandler(handle);
            }
        });
    }

    function addMessageHandler(handle) {
        if (typeof handle !== 'function') {
            console.error('Argument must be a function: ' + JSON.stringify(handle));
            return;
        }
        if (!isConnected()) {
            console.error('Must first be connected via connect() call');
            return;
        }
        ws.addEventListener('message', function (event) {
            handle(event.data);
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

    /*
     * Private functions
     */
    function cleanup() {
        _isConnected = false;
        ws = null;
    }

    function onOpen() {
        console.log('Connected');
        _isConnected = true;
    }

    function onClose() {
        console.log('Connection closed');
        cleanup();
    }

    function onError() {
        console.error('Error with connection: ' + JSON.stringify(error));
        cleanup();
    }

    /*
     * Public API
     */
    return {
        isConnected: isConnected,
        connect: connect,
        send: send,
        addMessageHandler: addMessageHandler
    };
}());