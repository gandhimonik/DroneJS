var minidrone = require('../index');

var navDataStream = minidrone.getNavDataStream();
navDataStream.subscribe((data) => {
                console.log(data);
            },
            err => debug(err),
            () => debug('complete'));


minidrone.connect('RS_')
    .then(() => minidrone.checkAllStates())
    .then()
    .catch((e) => {
        console.log('Error occurred: ' + e);
    });