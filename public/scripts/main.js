(function () {
    Socket.connect()
        .then(function () {
            console.log('Socket connected...');
            Socket.addMessageHandler(function (message) {
                console.log(JSON.stringify(message));
            });
            Socket.send('socket - hello');
        }).then(function () {
            var connectButton = document.getElementById('peer-connect');
            connectButton.onclick = function () {
                var peer = new Peer(function (message) {
                    Socket.send(JSON.stringify(message));
                });
                peer.connect();
            };
        });
}());