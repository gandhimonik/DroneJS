import { MiniDrone }    from '../index';

class SimpleFlight {

    constructor() {
        this.minidrone = new MiniDrone();
        this.keypress = require('keypress');

        this.keypress(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.resume();

        process.stdin.on('keypress', (ch, key) => {
            if (key && key.ctrl && key.name == 'c') {
                this.minidrone
                    .disconnect()
                    .then(() => process.exit(0))
                    .catch (e => {
                        console.log(e);
                        process.exit(0);
                    });
            }
        });
    }

    run() {
        this.minidrone
            .connect('RS_')
            .then(() => this.minidrone.listAllPictures())
            .then(pictures => this.minidrone.deletePicture(pictures[0]))
            .then(response => {
                if (response === 'success') {
                    console.log('picture deleted successfully...');
                }
            })
            .catch(e => {
                console.log('Error occurred: ' + e);
            });
    }
}

let simpleFlight = new SimpleFlight();
simpleFlight.run();