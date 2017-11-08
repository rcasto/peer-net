(function () {
    var peer = null;
    var connectButton = null;

    function onSocketMessage(rawMessage) {
        console.log('Message recieved: ' + rawMessage);

        var message = JSON.parse(rawMessage);

        if (message.desc) {
            switch(message.desc.type) {
                case 'offer':
                    console.log('Offer received');
                    peer.acceptOffer(message.desc);
                    break;
                case 'answer':
                    console.log('Answer received');
                    break;
                default:
                    console.error('Invalid SDP message: ' + rawMessage);
            }
        }
    }

    function onConnectClick() {
        Socket.addMessageHandler(onSocketMessage);        
        peer = new Peer(function (message) {
            Socket.send(message);
        });
        peer.connect();
        connectButton.disabled = true;
    }

    Socket.connect()
        .then(function () {
            console.log('Socket connected...');
        }).then(function () {
            connectButton = document.getElementById('peer-connect');
            connectButton.onclick = onConnectClick;
        });
}());