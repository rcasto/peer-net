var Peer = (function () {
    var configuration = { 
        iceServers: [{ 
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302',
                'stun:numb.viagenie.ca:3478'
            ]
        }] 
    };
    var channelName = 'peer-net';

    function Peer(signalCb) {
        var self = this;

        if (typeof signalCb !== 'function') {
            console.error('Peer constructor parameter must be a function - signal callback');
            return;
        }

        this.signalCb = signalCb;
        this.peer = new RTCPeerConnection(configuration);
        this.channel = null;

        // send any ice candidates to the other peer
        this.peer.onicecandidate = function (event) {
            self.signalCb({
                candidate: event.candidate 
            });
        };

        // let the "negotiationneeded" event trigger offer generation
        this.peer.onnegotiationneeded = function () {
            self.peer.createOffer()
                .then(function (offer) {
                    return self.peer.setLocalDescription(offer);
                })
                .then(function () {
                    // send the offer to the other peer
                    self.signalCb({ 
                        desc: self.peer.localDescription 
                    });
                })
                .catch(logError);
        };

        this.peer.onsignalingstatechange = function () {
            console.log('signal state changed', this.signalingState);
        };

        this.peer.oniceconnectionstatechange = function () {
            console.log('ice connection state change', this.iceConnectionState);
        };

        this.peer.onicegatheringstatechange	= function () {
            console.log('ice gathering state change', this.iceGatheringState);
        };

        this.peer.onicecandidateerror = function () {
            console.error('ice candidate error');
        };

        this.peer.onconnectionstatechange = function () {
            console.log('connection state change');
        };
    }

    Peer.prototype.connect = function () {
        this.channel = this.peer.createDataChannel(channelName);
        addDataChannelHandlers(this);
    };

    Peer.prototype.acceptOffer = function (offer) {
        var self = this;
        this.peer.ondatachannel = function (event) {
            self.channel = event.channel;
            addDataChannelHandlers(self);
        };
        return this.peer.setRemoteDescription(offer)
            .then(function () {
                return self.peer.createAnswer();
            })
            .then(function (answer) {
                return self.peer.setLocalDescription(answer);
            })
            .then(function () {
                var localDescription = self.peer.localDescription;
                self.signalCb({ 
                    desc: localDescription
                });
                return localDescription;
            })
            .catch(logError);
    };

    Peer.prototype.acceptAnswer = function (answer) {
        return this.peer.setRemoteDescription(answer)
            .catch(logError);        
    };


    Peer.prototype.acceptCandidate = function (candidate) {
        return this.peer.addIceCandidate(candidate)
            .catch(logError);        
    };

    /*
     * Private functions
     */
    function logError(error) {
        console.error('An error occurred: ' + JSON.stringify(error));
    }

    function addDataChannelHandlers(peer) {
        peer.channel.onopen = function () {
            console.log('Data channel opened');
        };
        peer.channel.onmessage = function (event) {
            console.log('Message received: ' + event.data);
        };
    }

    /*
     * Public API
     */
    return Peer;
}());