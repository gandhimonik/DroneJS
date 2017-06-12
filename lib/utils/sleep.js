"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sleep = sleep;
function sleep(time) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, time);
    });
}