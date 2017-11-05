var signalingChannel = new SignalingChannel();
var configuration = { iceServers: [{ urls: "stuns:stun.example.org" }] };
var pc;
var channel;

// call start(true) to initiate
function start(isInitiator) {
    pc = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        signalingChannel.send(JSON.stringify({ candidate: evt.candidate }));
    };

    // let the "negotiationneeded" event trigger offer generation
    pc.onnegotiationneeded = function () {
        pc.createOffer().then(function (offer) {
            return pc.setLocalDescription(offer);
        })
        .then(function () {
            // send the offer to the other peer
            signalingChannel.send(JSON.stringify({ desc: pc.localDescription }));
        })
        .catch(logError);
    };

    if (isInitiator) {
        // create data channel and setup chat
        channel = pc.createDataChannel("chat");
        setupChat();
    } else {
        // setup chat on incoming data channel
        pc.ondatachannel = function (evt) {
            channel = evt.channel;
            setupChat();
        };
    }
}

signalingChannel.onmessage = function (evt) {
    if (!pc)
        start(false);

    var message = JSON.parse(evt.data);
    if (message.desc) {
        var desc = message.desc;

        // if we get an offer, we need to reply with an answer
        if (desc.type == "offer") {
            pc.setRemoteDescription(desc).then(function () {
                return pc.createAnswer();
            })
            .then(function (answer) {
                return pc.setLocalDescription(answer);
            })
            .then(function () {
                var str = JSON.stringify({ desc: pc.localDescription });
                signalingChannel.send(str);
            })
            .catch(logError);
        } else
            pc.setRemoteDescription(desc).catch(logError);
    } else
        pc.addIceCandidate(message.candidate).catch(logError);
};

function setupChat() {
    channel.onopen = function () {
        // e.g. enable send button
        enableChat(channel);
    };

    channel.onmessage = function (evt) {
        showChatMessage(evt.data);
    };
}

function sendChatMessage(msg) {
    channel.send(msg);
}

function logError(error) {
    log(error.name + ": " + error.message);
}