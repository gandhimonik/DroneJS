var minidrone = require('../index');

minidrone.connect('RS_')
    .then(() => minidrone.listAllPictures())
    .then(pictures => minidrone.deletePicture(pictures[0]))
    .then(response => {
        if (response === 'success') {
            console.log('picture deleted successfully...');
        }
    })
    .catch((e) => {
        console.log('Error occurred: ' + e);
    });