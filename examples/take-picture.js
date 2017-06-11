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

    setupDataStream() {
        let navDataStream = this.minidrone.getNavDataStream();
        navDataStream.subscribe((data) => {
                console.log(data);
            },
            err => debug(err),
            () => debug('complete'));
    }

    run() {
        this.minidrone
            .connect('RS_')
            .then(() => this.minidrone.flatTrim())
            .then(() => this.minidrone.takeOff())
            .then(() => this.minidrone.flatTrim())
            .then(() => this.minidrone.takePicture())
            .then(() => this.minidrone.flatTrim())
            .then(() => this.minidrone.land())
            .then()
            .catch(e => {
                console.log('Error occurred: ' + e);
            });
    }
}

let simpleFlight = new SimpleFlight();
simpleFlight.setupDataStream();
simpleFlight.run();