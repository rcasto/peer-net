var Helpers = (function () {

    function tryParseJSON(data) {
        try {
            return JSON.parse(data);
        } catch(error) {
            return null;
        }
    }

    function hasClass(el, className) {
        return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
    }

    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else if (!hasClass(el, className)) {
            el.className += ' ' + className;
        }
    }

    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
        }
    }

    return {
        tryParseJSON: tryParseJSON,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass
    };
}());