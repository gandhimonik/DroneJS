'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debug = debug;
var pjson = require('../../package.json');

function debug() {
    if (pjson.debugging) {
        console.log.apply(null, Array.prototype.slice.call(arguments));
    }
}