var Logger = (function () {
    var logger = null;

    function Logger(container) {
        this.logContainer = container;
    }

    Logger.prototype.log = function (message) {
        var log = createLogElement(message, 'peer-log-info');
        appendLogElement(this.logContainer, log);
    };

    Logger.prototype.error = function (error) {
        var errorLog = createLogElement('An error occurred: ' + error, 'peer-log-error');
        appendLogElement(this.logContainer, errorLog);
    };

    function appendLogElement(container, log) {
        container.appendChild(log);
        container.scrollTop = container.scrollHeight;
    }

    function createLogElement(data, logClass) {
        var div = document.createElement('div');
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        div.innerHTML = data;
        div.className = logClass;
        return div;
    }
        
    return Logger;
}());