'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debug = debug;
exports.startLogging = startLogging;
var fs = require('fs'),
    debugging = false,
    stream = null;

function debug() {
    if (debugging) {
        if (stream) {
            var arr = Array.prototype.slice.call(arguments);
            arr.forEach(function (str) {
                str = typeof str === 'string' ? str : JSON.stringify(str);
                str += '\n';
                stream.write(str);
            });
        } else {
            console.log.apply(null, Array.prototype.slice.call(arguments));
        }
    }
}

function startLogging(dir) {
    if (dir) {
        dir = dir + '/dronejs_' + new Date().toISOString() + '.log';
        stream = fs.createWriteStream(dir);
    }
    debugging = true;
}