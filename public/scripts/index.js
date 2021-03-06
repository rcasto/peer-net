import './adapter';

import Peer from './peer';
import Logger from './logger';
import Helpers from './helpers';

var peer = null;
var logger = null;

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
var peerLog = null;

function onSignalerMessage(message) {
    if (message.desc) {
        switch (message.desc.type) {
            case 'offer':
                logger.log('Offer generated');
                sdpOfferText.readOnly = true;
                appendTextToTextArea(sdpOfferText, JSON.stringify(message.desc));
                break;
            case 'answer':
                logger.log('Answer generated');
                sdpOfferText.value = '';
                sdpOfferText.readOnly = true;
                offerAcceptButton.hidden = true;
                answerCopyButton.hidden = false;
                appendTextToTextArea(sdpOfferText, JSON.stringify(message.desc));
                break;
            default:
                logger.error('Invalid message: ' + message);
        }
    } else if (message.type === 'candidate') {
        appendTextToTextArea(sdpOfferText, JSON.stringify(message));
    }
}

function onOfferCreateClick() {
    peer.connect();
    offerCreateButton.hidden = true;
    offerCopyButton.hidden = false;
    peerPageButtonContainer.hidden = false;
}

function onAcceptClick(textArea, event) {
    var sdpInfo = Helpers.tryParseJSON(textArea.value);
    var sdp = sdpInfo[0];
    var candidateEvents = sdpInfo.slice(1);
    if (sdp) {
        event.target.disabled = true;
        if (sdp.type === 'offer') {
            peer.acceptOffer(sdp);                
        } else {
            peer.acceptAnswer(sdp);
        }
        candidateEvents.forEach(function (candidateEvent) {
            peer.acceptCandidate(candidateEvent.candidate);
        });
    } else {
        console.error('Invalid sdp', sdp);
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
    if (typeof clickedPage !== 'undefined') {
        Helpers.removeClass(activePeerPageButton, 'active');
        Helpers.addClass(event.target, 'active');
        peerPages[currentPage].hidden = true;            
        peerPages[clickedPage].hidden = false;
        activePeerPageButton = event.target;            
    }
}

function appendTextToTextArea(textArea, text) {
    var currentText = textArea.value, currentJSONArray;
    if (currentText) {
        currentJSONArray = Helpers.tryParseJSON(currentText);
        if (currentJSONArray) {
            currentJSONArray.push(Helpers.tryParseJSON(text));                
            textArea.value = JSON.stringify(currentJSONArray);
        }
    } else {
        textArea.value = JSON.stringify([Helpers.tryParseJSON(text)]);
    }
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
    peerLog = document.querySelector('.peer-log');

    logger = new Logger(peerLog);
    peer = new Peer(onSignalerMessage, logger);

    offerCreateButton.onclick = onOfferCreateClick;
    offerAcceptButton.onclick = onAcceptClick.bind(null, sdpOfferText);
    answerAcceptButton.onclick =  onAcceptClick.bind(null, sdpAnswerText);
    offerCopyButton.onclick = onCopyClick.bind(null, sdpOfferText);
    answerCopyButton.onclick = onCopyClick.bind(null, sdpOfferText);        
    sdpOfferText.onclick = onTextAreaClick;
    sdpOfferText.oninput = onOfferTextAreaInput;        
    sdpAnswerText.onclick = onTextAreaClick;
    sdpAnswerText.oninput = onAnswerTextAreaInput;
    peerPageButtonContainer.onclick = onPeerPageClick;
};