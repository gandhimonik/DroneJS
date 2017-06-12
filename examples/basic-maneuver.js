var minidrone = require('../index');

var navDataStream = minidrone.getNavDataStream();
navDataStream.subscribe((data) => {
        console.log(data);
    },
    err => debug(err),
    () => debug('complete'));


minidrone.connect('RS_')
    .then(() => minidrone.flatTrim())
    .then(() => minidrone.takeOff())
    .then(() => minidrone.flatTrim())
    .then(() => minidrone.forward(50, 5))
    .then(() => minidrone.flatTrim())
    .then(() => minidrone.land())
    .then()
    .catch((e) => {
        console.log('Error occurred: ' + e);
    });