let pjson = require('../../package.json');

export function debug(str) {
    if (pjson.debugging) {
        console.log(str);
    }
}