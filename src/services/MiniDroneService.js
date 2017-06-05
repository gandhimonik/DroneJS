import { debug }                from '../utils/debug';
import { Observable }           from 'rxjs/Observable';

export class MiniDroneService {

    constructor() {
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

    discoverCharacteristics(services) {
        return new Promise((resolve, reject) => {
            try {
                let ids = [],
                    chars = [];
                services.forEach((service, idx, array) => {
                    service.on('characteristicsDiscover', function(characteristics) {
                        debug('characteristics found: ' + characteristics);
                        chars = chars.concat(characteristics);
                        ids.push(idx);

                        if (ids.length === array.length) {
                            resolve(chars);
                        }
                    });
                    service.discoverCharacteristics();
                })


            } catch (e) {
                reject(e);
            }
        });
    }

    identifyCharacteristics(characteristics) {
        return new Promise((resolve, reject) => {
            try {
                let cmdChars = characteristics.filter((char) => char.uuid.indexOf("fa") >= 0),
                    notifyChars = characteristics.filter((char) => char.uuid.indexOf("fb") >= 0),
                    ftpChars = characteristics.filter((char) => char.uuid.indexOf("fd2") >= 0);

                this.cmdService = cmdChars[10];
                this.cmdObservable = this.createObservable(notifyChars);
                this.ftpGetService = ftpChars[1];
                this.ftpHandlingService = ftpChars[2];
                this.ftpObservable = this.createObservable(ftpChars);

                this.subscribeToNotify(notifyChars).then(() => {
                    this.subscribeToNotify(ftpChars).then(() => {
                        resolve('success');
                    }).catch(e => {
                        reject(e);
                    });
                }).catch(e => {
                    reject(e);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    subscribeToNotify(characteristics) {
        return new Promise((resolve, reject) => {
            try {
                let ids = [];
                characteristics.forEach((char, idx, array) => {
                    char.on('notify', function(state) {
                        // debug('on -> notify: ' + this.uuid + ': ' + state);

                        ids.push(idx);
                        if (ids.length === array.length) {
                            debug('subscribed to characteristics...');
                            resolve('success');
                        }
                    });

                    char.notify(true);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    createObservable(characteristics) {
        return Observable
                .create(observer => {
                    debug('Creating observable...');
                    characteristics.forEach((char) => {
                        char.on('data', function (data) {
                            let arr = (char.uuid.indexOf('fb') >= 0) ? Array.prototype.slice.call(data, 0).join('+')
                                            : data;
                            observer.next(arr);
                        });
                    });

                    return function () {
                        debug('observable disposed');
                    }
                });

    }

    sendNavCommand(buffer) {
        return new Promise((resolve, reject) => {
            try {
                debug('Sending Command...');
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
                debug('Sending FTP Command...');
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
