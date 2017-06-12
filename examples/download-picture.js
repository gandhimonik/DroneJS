var minidrone = require('../index');

minidrone.connect('RS_')
    .then(() => minidrone.listAllPictures())
    .then(pictures => minidrone.downloadPicture(pictures[0], 'output'))
    .then(response => {
        if (response === 'success') {
            console.log('picture downloaded successfully...');
        }
    })
    .catch((e) => {
        console.log('Error occurred: ' + e);
    });