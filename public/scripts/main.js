(function () {
    var peer = new Peer(onSignalerMessage);
    var offerAnswerButton = null;
    var sdpTextArea = null;

    function onSignalerMessage(message) {
        console.log(message);
        if (message.desc) {
            switch (message.desc.type) {
                case 'offer':
                    console.log('Offer generated');
                    sdpTextArea.readOnly = true;
                    appendTextToTextArea(JSON.stringify(message.desc));
                    break;
                case 'answer':
                    console.log('Answer generated');
                    break;
                default:
                    console.error('Invalid message: ' + message);
            }
        } else if (message.candidate) {
            appendTextToTextArea(JSON.stringify(message));
        }
    }

    function tryParseJSON(data) {
        try {
            return JSON.parse(data);
        } catch(error) {
            return null;
        }
    }

    function appendTextToTextArea(text) {
        var currentText = sdpTextArea.value, currentJSON;
        if (currentText) {
            currentJSON = tryParseJSON(currentText);
            if (currentJSON) {
                currentJSON = [currentJSON, text];
                sdpTextArea.value = JSON.stringify(currentJSON);
            } else {
                sdpTextArea.value += text;
            }
        } else {
            sdpTextArea.value = text;
        }
    }

    function onOfferClick() {
        peer.connect();
        offerButton.hidden = true;
        copyButton.hidden = false;
    }

    function onCopyClick() {
        sdpTextArea.select();
        document.execCommand('copy');
    }

    function onAcceptOfferClick() {
        
    }

    function onTextAreaClick() {
        sdpTextArea.select();
    }

    function onTextAreaInput() {
        var text = sdpTextArea.value;
        offerButton.hidden = !!text;
        offerAcceptButton.hidden = !text;
    }

    /*
     * Interesting idea: Based on whether the client is actually on or not, default the mode.
     * If the user is offline, start in offline mode.  Allow the user toggle modes, but default
     * based on their coming in state
     */
    window.onload = function () {
        offerButton = document.getElementById('peer-offer');
        copyButton = document.getElementById('peer-copy');
        offerAcceptButton = document.getElementById('peer-offer-accept');      
        sdpTextArea = document.getElementById('peer-sdp');

        offerButton.onclick = onOfferClick;
        copyButton.onclick = onCopyClick;
        offerAcceptButton.onclick = onAcceptOfferClick;

        sdpTextArea.onclick = onTextAreaClick;
        sdpTextArea.oninput = onTextAreaInput;
    };
}());