var Helpers = (function () {

    function tryParseJSON(data) {
        try {
            return JSON.parse(data);
        } catch(error) {
            return null;
        }
    }

    return {
        tryParseJSON: tryParseJSON
    };
}());