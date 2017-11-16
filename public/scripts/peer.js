var Peer = (function () {
    var configuration = { 
        iceServers: [{ 
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302'
            ]
        }] 
    };
    var channelName = 'peer-net';

    function Peer(signalCb, logger) {
        var self = this;

        this.signalCb = signalCb;
        this.logger = logger || console;
        this.peer = new RTCPeerConnection(configuration);
        this.channel = null;

        // send any ice candidates to the other peer
        this.peer.onicecandidate = function (event) {
            if (event.candidate) {
                self.signalCb({
                    candidate: event.candidate,
                    type: 'candidate'
                });
            }
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
                .catch(self.logger.error.bind(self.logger));
        };

        this.peer.onsignalingstatechange = function () {
            self.logger.log('signal state changed: ' + self.peer.signalingState);
        };

        this.peer.oniceconnectionstatechange = function () {
            self.logger.log('ice connection state change: ' + self.peer.iceConnectionState);
        };

        this.peer.onicegatheringstatechange	= function () {
            self.logger.log('ice gathering state change: ' + self.peer.iceGatheringState);
        };

        this.peer.onicecandidateerror = function () {
            self.logger.error('ice candidate error');
        };

        this.peer.onconnectionstatechange = function () {
            self.logger.log('connection state change');
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
            .catch(this.logger.error.bind(this.logger));
    };

    Peer.prototype.acceptAnswer = function (answer) {
        return this.peer.setRemoteDescription(answer)
            .catch(this.logger.error.bind(this.logger));        
    };


    Peer.prototype.acceptCandidate = function (candidate) {
        return this.peer.addIceCandidate(candidate)
            .catch(this.logger.error.bind(this.logger));        
    };

    /*
     * Private functions
     */
    function addDataChannelHandlers(peer) {
        peer.channel.onopen = function () {
            peer.logger.log('Data channel opened');
        };
        peer.channel.onmessage = function (event) {
            peer.logger.log('Message received: ' + event.data);
        };
    }

    /*
     * Public API
     */
    return Peer;
}());