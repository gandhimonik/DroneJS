import { debug }        from '../utils/debug';
import { EventEmitter } from 'events';
import { Observable }   from 'rxjs';

export class MiniDroneService extends EventEmitter {

    constructor() {
        super();
        this.drone = null;
        this.cmdService = null;
        this.ftpGetService = null;
        this.ftpHandlingService = null;
        this.cmdObservable = null;
        this.ftpObservable = null;
        this.noble = require('noble');
    }

    startScanning() {
        return new Promise((resolve, reject) => {
            try {
                this.noble.on('scanStart', () => {
                    debug('scanning devices...');
                    resolve("success");
                });

                this.noble.on('stateChange', (state) => {
                    try {
                        (state === 'poweredOn') ? this.noble.startScanning() : this.noble.stopScanning();
                    } catch(e) {
                        reject(e);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    stopScanning() {
        return new Promise((resolve, reject) => {
            try {
                this.noble.on('scanStop', () => {
                    debug('scanning stopped...');
                    resolve("success");
                });

                this.noble.stopScanning();
            } catch (e) {
                reject(e);
            }
        });
    }

    discoverDevice(droneIdentifier) {
        return new Promise((resolve, reject) => {
            try {
                this.noble.on('discover', (peripheral) => {
                    if ((peripheral.advertisement.localName &&
                        peripheral.advertisement.localName.includes(droneIdentifier)) ||
                        peripheral.advertisement.uuid === droneIdentifier) {
                        debug('peripheral discovered: '+ peripheral.advertisement.localName +
                            ' at promixity: ' + peripheral.rssi);
                        resolve(peripheral);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    connect(peripheral) {
        return new Promise((resolve, reject) => {
            let self = this;
            try {
                peripheral.on('connect', function() {
                    debug('handshake completed...');
                    self.drone = peripheral;
                    resolve("success");
                });

                peripheral.connect();
            } catch (e) {
                reject(e);
            }
        });
    }

    updateProximity() {
        return new Promise((resolve, reject) => {
            try {
                this.drone.on('rssiUpdate', function(rssi) {
                    debug("proximity updated to: " + rssi);
                    resolve("success");
                });

                this.drone.updateRssi();
            } catch (e) {
                reject(e);
            }
        });
    }

    discoverServices() {
        return new Promise((resolve, reject) => {
            try {
                this.drone.on('servicesDiscover', function(services) {
                    debug('services found: ' + services);
                    resolve(services);
                });

                this.drone.discoverServices();
            } catch (e) {
                reject(e);
            }
        });
    }

    discoverCharacteristics(service) {
        return new Promise((resolve, reject) => {
            let self = this;
            try {
                service.on('characteristicsDiscover', function(characteristics) {
                    debug('characteristics found: ' + characteristics);
                    self.identifyCharacteristics(characteristics);
                    resolve("success");
                });
                service.discoverCharacteristics();
            } catch (e) {
                reject(e);
            }
        });
    }

    identifyCharacteristics(characteristics) {
        let cmdChars = characteristics.filter((char) => char.uuid.indexOf("fa") >= 0),
            notifyChars = characteristics.filter((char) => char.uuid.indexOf("fb") >= 0),
            ftpChars = characteristics.filter((char) => char.uuid.indexOf("fd21") >= 0);

        if (cmdChars.length > 0) {
            this.cmdService = cmdChars[10];
        }

        if (notifyChars.length > 0) {
            this.cmdObservable = this.createObservable(notifyChars);
        }

        if (ftpChars.length > 0) {
            this.ftpGetService = ftpChars[1];
            this.ftpHandlingService = ftpChars[2];

            this.ftpObservable = this.createObservable(ftpChars);
        }
    }

    createObservable(characteristics) {
        return Observable.create(function (observer) {

            characteristics.forEach((char) => {
                char.on('data', function (data, isNotification) {
                    observer.next(data);
                });
            });

            return function () {
                debug('observable unsubscribed');
            }
        });
    }

    sendDroneCommand(buffer) {
        return new Promise((resolve, reject) => {
            try {
                this.cmdService.write(buffer, false);
                resolve("success");
            } catch (e) {
                reject(e);
            }
        });
    }

    sendFTPCommand(buffer, thruGetService) {
        return new Promise((resolve, reject) => {
            try {
                if (thruGetService) {
                    this.ftpGetService.write(buffer, false);
                } else {
                    this.ftpHandlingService.write(buffer, false);
                }
                resolve("success");
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
}
