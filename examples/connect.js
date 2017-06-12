var minidrone = require('../index');

minidrone.connect('RS_')
        .then()
        .catch((e) => {
            console.log('Error occurred: ' + e);
        });