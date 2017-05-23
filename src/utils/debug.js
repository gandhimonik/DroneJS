let pjson = require('../../package.json');

export function debug() {
    if (pjson.debugging) {
        console.log.apply(null, Array.prototype.slice.call(arguments));
    }
}