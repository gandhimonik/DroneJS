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

    connect() {
        this.minidrone
            .connect('RS_')
            .then(response => {
                if (response === 'success') {
                    console.log('drone connected successfully...');
                }
            })
            .catch((e) => {
                console.log('Error occurred: ' + e);
            });
    }
}

let simpleFlight = new SimpleFlight();
simpleFlight.connect();