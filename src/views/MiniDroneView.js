import { MiniDroneController }     from '../controllers/MiniDroneController';
import { Observable }              from 'rxjs/Observable';
import { debug }                   from '../utils/debug';

export class MiniDroneView {

    constructor() {
        this.droneController = new MiniDroneController();
        this.navdata = {};
        this.fs = require('fs');
        this.md5Length = 32;
    }

    connect(droneIdentifier) {
        return new Promise((resolve, reject) => {
            this.droneController.connect(droneIdentifier).then(() => {
                debug('Drone connected successfully');
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    checkAllStates() {
        return new Promise((resolve, reject) => {
            this.droneController.checkAllStates().then(() => {
                resolve('success');
            }).catch((e) => {
                reject(e);
            });
        });
    }

    flatTrim() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('piloting', 'flatTrim').then(() => {
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    takeOff() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('piloting', 'takeOff').then(() => {
                let callback = navObj => {
                    if (navObj.state === 'hovering') {
                        debug('Drone has took off');
                        this.droneController.removeListener('flyingStateChanged', callback);
                        resolve('success');
                    }

                };

                this.droneController.on('flyingStateChanged', callback);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    turnLeft(intensity, duration) {
        return new Promise((resolve, reject) => {
            if (!(intensity >= -100 && intensity <= 0)) {
                reject('Error: Value for intensity should be between -100 and 0');
            }

            let args = [0, 0, 0, intensity, 0, duration];
            this.droneController.sendPilotingCommand('piloting', 'maneuver', args).then(() => {
                setTimeout(() => {
                    resolve("success");
                }, duration);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    turnRight(intensity, duration) {
        return new Promise((resolve, reject) => {
            if (!(intensity >= 1 && intensity <= 100)) {
                reject('Error: Value for intensity should be between 1 and 100');
            }

            let args = [0, 0, 0, intensity, 0, duration];
            this.droneController.sendPilotingCommand('piloting', 'maneuver', args).then(() => {
                setTimeout(() => {
                    resolve("success");
                }, duration);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    goBackward(intensity, duration) {
        return new Promise((resolve, reject) => {
            if (!(intensity >= -100 && intensity <= 0)) {
                reject('Error: Value for intensity should be between -100 and 0');
            }

            let args = [0, 0, intensity, 0, 0, duration];
            this.droneController.sendPilotingCommand('piloting', 'maneuver', args).then(() => {
                setTimeout(() => {
                    resolve("success");
                }, duration);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    goForward(intensity, duration) {
        return new Promise((resolve, reject) => {
            if (!(intensity >= 1 && intensity <= 100)) {
                reject('Error: Value for intensity should be between 1 and 100');
            }

            let args = [0, 0, intensity, 0, 0, duration];
            this.droneController.sendPilotingCommand('piloting', 'maneuver', args).then(() => {
                setTimeout(() => {
                    resolve("success");
                }, duration);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    goLeft(intensity, duration) {
        return new Promise((resolve, reject) => {
            if (!(intensity >= -100 && intensity <= 0)) {
                reject('Error: Value for intensity should be between -100 and 0');
            }

            let args = [0, intensity, 0, 0, 0, duration];
            this.droneController.sendPilotingCommand('piloting', 'maneuver', args).then(() => {
                setTimeout(() => {
                    resolve("success");
                }, duration);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    goRight(intensity, duration) {
        return new Promise((resolve, reject) => {
            if (!(intensity >= 1 && intensity <= 100)) {
                reject('Error: Value for intensity should be between 1 and 100');
            }

            let args = [0, intensity, 0, 0, 0, duration];
            this.droneController.sendPilotingCommand('piloting', 'maneuver', args).then(() => {
                setTimeout(() => {
                    resolve("success");
                }, duration);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    frontFlip() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('animations', 'flip', [0]).then(() => {
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    backFlip() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('animations', 'flip', [1]).then(() => {
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    rightFlip() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('animations', 'flip', [2]).then(() => {
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    leftFlip() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('animations', 'flip', [3]).then(() => {
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    takePicture() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('mediaRecord', 'picture', [0]).then(() => {
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    listAllPictures() {
        return new Promise((resolve, reject) => {
            let imgArr = [],
                str = '',
                regex = /(Rolling_Spider_[A-Z0-9_+\-]*.jpg)/g;

            let callback = mediaObj => {
                if (mediaObj.state === 'LIS') {
                    str += mediaObj.data.toString('utf8');
                    str = str.replace('\u0000', '')
                             .replace('\u0001', '')
                             .replace('\u0002', '')
                             .replace('\u0003', '');

                    if (str.toLowerCase().indexOf('end of transfer') >= 0) {
                        imgArr = str.match(regex);
                        debug(imgArr);
                        this.droneController.removeListener('media-data', callback);
                        resolve(imgArr);
                    }
                }

            };

            this.droneController.on('media-data', callback);

            this.droneController.sendMediaCommand('LIS', '/internal_000/Rolling_Spider/media').then(() => {
            }).catch((e) => {
                reject(e);
            });
        });
    }

    downloadPicture(name, downloadPath) {
        return new Promise((resolve, reject) => {
            let stream = this.fs.createWriteStream(downloadPath + '/' + name),
                ignoreBytes = 0;

            let callback = mediaObj => {
                if (mediaObj.state === 'GET' || mediaObj.state === 'MD5 OK') {
                    let dataStr = mediaObj.data.toString('utf8');

                    if (dataStr.toLowerCase().indexOf('end of transfer') >= 0) {
                        debug('Closing the stream');
                        stream.end();
                        this.droneController.removeListener('media-data', callback);
                        resolve('success');
                    } else if (dataStr.indexOf('MD5') >= 0) {
                        debug('Packet ended');
                        ignoreBytes = this.md5Length;
                        ignoreBytes -= dataStr.length;
                        this.droneController.sendMediaCommand('MD5 OK', '')
                                            .then(() => {})
                                            .catch((e) => {
                                                reject(e);
                                            });
                    } else if (ignoreBytes) {
                        ignoreBytes -= dataStr;
                    } else {
                        stream.write(mediaObj.data.slice(1));
                    }
                }

            };

            this.droneController.on('media-data', callback);

            this.droneController.sendMediaCommand('GET', '/internal_000/Rolling_Spider/media/' + name).then(() => {
            }).catch((e) => {
                reject(e);
            });
        });
    }

    deletePicture(name) {
        return new Promise((resolve, reject) => {
            let confirmArr = [];

            let callback = mediaObj => {
                if (mediaObj.state === 'DEL') {
                    let str = mediaObj.data.toString('utf8');
                    if (str.toLowerCase().indexOf('delete successful') >= 0) {
                        debug(str);
                        confirmArr.push(str);

                        if (confirmArr.length === 2) {
                            this.droneController.removeListener('media-data', callback);
                            resolve('success');
                        }
                    }
                }
            };

            this.droneController.on('media-data', callback);

            this.droneController.sendMediaCommand('DEL', '/internal_000/Rolling_Spider/thumb/' + name)
                                .then(() => {})
                                .catch((e) => {
                                    reject(e);
                                });

            this.droneController.sendMediaCommand('DEL', '/internal_000/Rolling_Spider/media/' + name)
                                .then(() => {})
                                .catch((e) => {
                                    reject(e);
                                });
        });
    }

    land() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('piloting', 'landing').then(() => {
                let callback = navObj => {
                    if (navObj.state === 'landed') {
                        debug('Drone has landed');
                        this.droneController.removeListener('flyingStateChanged', callback);
                        resolve('success');
                    }

                };

                this.droneController.on('flyingStateChanged', callback);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            this.droneController.disconnect().then(() => {
                debug('Drone disconnected successfully');
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    getNavDataStream() {
        return Observable
                .create(observer => {
                    debug('Creating observer...');
                    this.droneController.on('data', navInfo => {
                        this.navdata[navInfo.name] = {};
                        navInfo.args.forEach(arg => {
                            this.navdata[navInfo.name][arg.name] = arg.value;
                        });
                        observer.next(this.navdata);
                    });

                    return function () {
                        debug('ending the stream');
                    }
                });
    }
}