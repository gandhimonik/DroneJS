let fs = require('fs'),
    debugging = false,
    stream = null;

export function debug() {
    if (debugging) {
        if (stream) {
            let arr = Array.prototype.slice.call(arguments);
            arr.forEach((str) => {
                str = (typeof str === 'string') ? str : JSON.stringify(str);
                str += '\n';
                stream.write(str);
            });
        } else {
            console.log.apply(null, Array.prototype.slice.call(arguments));
        }
    }
}

export function startLogging(dir) {
    if (dir) {
        dir = dir + '/dronejs_' + new Date().toISOString() + '.log';
        stream = fs.createWriteStream(dir);
    }
    debugging = true;
}