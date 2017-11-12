(function () {
    var peer = new Peer(onSignalerMessage);
    var offerCreateButton = null;
    var offerAcceptButton = null;
    var offerCopyButton = null;
    var answerCopyButton = null;
    var sdpOfferText = null;
    var sdpAnswerText = null;
    var answerAcceptButton = null;
    var peerPageButtonContainer = null;
    var activePeerPageButton = null;
    var peerPages = null;
    var peerPageButtons = null;

    function onSignalerMessage(message) {
        console.log(message);
        if (message.desc) {
            switch (message.desc.type) {
                case 'offer':
                    console.log('Offer generated');
                    sdpOfferText.readOnly = true;
                    appendTextToTextArea(sdpOfferText, JSON.stringify(message.desc));
                    break;
                case 'answer':
                    console.log('Answer generated');
                    sdpOfferText.value = '';
                    sdpOfferText.readOnly = true;
                    offerAcceptButton.hidden = true;
                    answerCopyButton.hidden = false;
                    appendTextToTextArea(sdpOfferText, JSON.stringify(message.desc));
                    break;
                default:
                    console.error('Invalid message: ' + message);
            }
        } else if (message.candidate) {
            appendTextToTextArea(JSON.stringify(message));
        }
    }

    function appendTextToTextArea(textArea, text) {
        var currentText = textArea.value, currentJSON;
        if (currentText) {
            currentJSON = Helpers.tryParseJSON(currentText);
            if (currentJSON) {
                currentJSON = [currentJSON, text];
                textArea.value = JSON.stringify(currentJSON);
            } else {
                textArea.value += text;
            }
        } else {
            textArea.value = text;
        }
    }

    function onOfferCreateClick() {
        peer.connect();
        offerCreateButton.hidden = true;
        offerCopyButton.hidden = false;
        peerPageButtonContainer.hidden = false;
    }

    function onOfferAcceptClick() {
        var offer = Helpers.tryParseJSON(sdpOfferText.value);
        if (offer) {
            offerAcceptButton.disabled = true;
            peer.acceptOffer(offer);
        } else {
            console.error('Invalid offer');
        }
    }

    function onAcceptAnswerClick() {
        var answer = Helpers.tryParseJSON(sdpAnswerText.value);
        if (answer) {
            answerAcceptButton.disabled = true;
            peer.acceptAnswer(answer);
        } else {
            console.error('Invalid answer');
        }
    }

    function onCopyClick(textArea) {
        textArea.select();
        document.execCommand('copy');
    }

    function onTextAreaClick(event) {
        event.target.select();
    }

    function onOfferTextAreaInput(event) {
        var text = event.target.value;
        offerCreateButton.hidden = !!text;
        offerAcceptButton.hidden = !text;
    }

    function onAnswerTextAreaInput(event) {
        var text = event.target.value;
        answerAcceptButton.disabled = !text;
    }

    function onPeerPageClick(event) {
        var currentPage, clickedPage;
        if (event.target === activePeerPageButton) {
            return;
        }
        peerPageButtons.forEach(function (peerPageButton, i) {
            if (peerPageButton === activePeerPageButton) {
                currentPage = i;
            }
            if (peerPageButton === event.target) {
                clickedPage = i;
            }
        });
        Helpers.removeClass(activePeerPageButton, 'active');
        Helpers.addClass(event.target, 'active');
        peerPages[currentPage].hidden = true;
        peerPages[clickedPage].hidden = false;
        activePeerPageButton = event.target;
    }

    window.onload = function () {
        offerCreateButton = document.querySelector('.peer-offer-create');
        offerAcceptButton = document.querySelector('.peer-offer-accept');
        offerCopyButton = document.querySelector('.peer-offer-copy');
        answerCopyButton = document.querySelector('.peer-answer-copy');
        sdpOfferText = document.querySelector('.peer-sdp-offer');
        sdpAnswerText = document.querySelector('.peer-sdp-answer');
        answerAcceptButton = document.querySelector('.peer-answer-accept');
        peerPageButtonContainer = document.querySelector('.peer-page-buttons');
        activePeerPageButton = document.querySelector('.peer-page-button.active');
        peerPages = document.querySelectorAll('.peer-page');
        peerPageButtons = document.querySelectorAll('.peer-page-button');

        offerCreateButton.onclick = onOfferCreateClick;
        offerAcceptButton.onclick = onOfferAcceptClick;
        offerCopyButton.onclick = onCopyClick.bind(null, sdpOfferText);
        answerCopyButton.onclick = onCopyClick.bind(null, sdpOfferText);
        answerAcceptButton.onclick = onAcceptAnswerClick;        
        sdpOfferText.onclick = onTextAreaClick;
        sdpOfferText.oninput = onOfferTextAreaInput;        
        sdpAnswerText.onclick = onTextAreaClick;
        sdpAnswerText.oninput = onAnswerTextAreaInput;
        peerPageButtonContainer.onclick = onPeerPageClick;
    };
}());