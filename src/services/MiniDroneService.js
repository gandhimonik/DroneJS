import { debug } from '../utils/debug';

let noble =  require('noble');


export class MiniDroneService {

    constructor() {
        this.drone = null;
        this.addNobleListeners();
    }

    connect(droneIdentifier) {
        return new Promise((resolve, reject) => {
            try {
                noble.on('stateChange', (state) => {
                    (state === 'poweredOn') ? noble.startScanning() : noble.stopScanning();
                });

                noble.on('discover', (peripheral) => {
                    if ((peripheral.advertisement.localName &&
                        peripheral.advertisement.localName.includes(droneIdentifier)) ||
                        peripheral.advertisement.uuid === droneIdentifier) {
                        debug('peripheral discovered: '+ peripheral.advertisement.localName +
                            ' at promixity: ' + peripheral.rssi);
                        debug('Connecting...');

                        this.drone = peripheral;
                        this.addDroneListeners();
                        this.drone.connect();

                        this.drone.on('rssiUpdate', function(rssi) {
                            debug("connection successful at proximity: " + rssi);
                            resolve("success");
                        });
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            try {
                debug('disconnecting drone...')
                this.drone.disconnect();
                resolve("success");
            } catch (e) {
                reject(e);
            }
        });
    }

    addNobleListeners() {
        noble.on('scanStart', () => debug('scanning devices...'));

        noble.on('scanStop', () => debug('scanning stopped...'));
    }

    addDroneListeners() {
        this.drone.on('connect', function() {
            debug('updating proximity...');
            this.updateRssi();
        });

        this.drone.on('disconnect', function() {
            debug('drone disconnected');
        });
    }
}
