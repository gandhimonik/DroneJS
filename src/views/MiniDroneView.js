import { MiniDroneController }     from '../controllers/MiniDroneController';
import { Observable }              from 'rxjs/Observable';
import { debug, startLogging }   from '../utils/debug';
import { sleep }                   from '../utils/sleep';

export class MiniDroneView {

    constructor() {
        this.droneController = new MiniDroneController();
        this.navdata = {};
        this.fs = require('fs');
        this.breathingTime = 200;
        this.cmdInterval = 0;
        this.dirName = null;
    }

    enableLogging(dir) {
        return new Promise((resolve, reject) => {
            try {
                startLogging(dir);
                resolve('success');
            } catch (e) {
                reject(e);
            }
        });
    }

    connect(droneIdentifier) {
        return new Promise((resolve, reject) => {
            this.droneController.connect(droneIdentifier).then(() => {
                debug('Drone connected successfully');
                sleep(this.breathingTime).then(() => {
                    resolve('success');
                });
            }).catch((e) => {
                reject(e);
            });
        });
    }

    checkAllStates() {
        return new Promise((resolve, reject) => {
            this.droneController.checkAllStates().then(() => {
                sleep(this.breathingTime).then(() => {
                    resolve('success');
                });
            }).catch((e) => {
                reject(e);
            });
        });
    }

    flatTrim() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('piloting', 'flatTrim').then(() => {
                sleep(this.breathingTime).then(() => {
                    resolve('success');
                });
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
                        sleep(this.breathingTime).then(() => {
                            resolve('success');
                        });
                    } else if (navObj.state === 'takingoff') {
                        debug('sending flat trim');
                        this.flatTrim();
                    }
                };

                this.droneController.on('flyingStateChanged', callback);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    turnLeft(intensity, frequency) {
        return new Promise((resolve, reject) => {
            if (!this._isValid(intensity)) {
                reject('Error: Value for intensity should be between 0 and 100');
            }
            intensity -= 100;

            let args = [0, 0, 0, intensity, 0, 0];
            this._execManeuver(args, frequency).then(() => {
                resolve('success');
            }).catch(e => {
                reject(e);
            })
        });
    }

    turnRight(intensity, frequency) {
        return new Promise((resolve, reject) => {
            if (!this._isValid(intensity)) {
                reject('Error: Value for intensity should be between 0 and 100');
            }

            let args = [0, 0, 0, intensity, 0, 0];
            this._execManeuver(args, frequency).then(() => {
                resolve('success');
            }).catch(e => {
                reject(e);
            })
        });
    }

    backward(intensity, frequency) {
        return new Promise((resolve, reject) => {
            if (!this._isValid(intensity)) {
                reject('Error: Value for intensity should be between 0 and 100');
            }
            intensity -= 100;

            let args = [1, 0, intensity, 0, 0, 0];
            this._execManeuver(args, frequency).then(() => {
                resolve('success');
            }).catch(e => {
                reject(e);
            })
        });
    }

    forward(intensity, frequency) {
        return new Promise((resolve, reject) => {
            if (!this._isValid(intensity)) {
                reject('Error: Value for intensity should be between 0 and 100');
            }

            let args = [1, 0, intensity, 0, 0, 0];
            this._execManeuver(args, frequency).then(() => {
                resolve('success');
            }).catch(e => {
                reject(e);
            })
        });
    }

    left(intensity, frequency) {
        return new Promise((resolve, reject) => {
            if (!this._isValid(intensity)) {
                reject('Error: Value for intensity should be between 0 and 100');
            }
            intensity -= 100;

            let args = [1, intensity, 0, 0, 0, 0];
            this._execManeuver(args, frequency).then(() => {
                resolve('success');
            }).catch(e => {
                reject(e);
            })
        });
    }

    right(intensity, frequency) {
        return new Promise((resolve, reject) => {
            if (!this._isValid(intensity)) {
                reject('Error: Value for intensity should be between 0 and 100');
            }

            let args = [1, intensity, 0, 0, 0, 0];
            this._execManeuver(args, frequency).then(() => {
                resolve('success');
            }).catch(e => {
                reject(e);
            })
        });
    }

    down(intensity, frequency) {
        return new Promise((resolve, reject) => {
            if (!this._isValid(intensity)) {
                reject('Error: Value for intensity should be between 0 and 100');
            }
            intensity -= 100;

            let args = [0, 0, 0, 0, intensity, 0];
            this._execManeuver(args, frequency).then(() => {
                resolve('success');
            }).catch(e => {
                reject(e);
            })
        });
    }

    up(intensity, frequency) {
        return new Promise((resolve, reject) => {
            if (!this._isValid(intensity)) {
                reject('Error: Value for intensity should be between 0 and 100');
            }

            let args = [0, 0, 0, 0, intensity, 0];
            this._execManeuver(args, frequency).then(() => {
                resolve('success');
            }).catch(e => {
                reject(e);
            })
        });
    }

    frontFlip() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('animations', 'flip', [0, 0, 0, 0]).then(() => {
                sleep(this.breathingTime + 1000).then(() => {
                    resolve('success');
                });
            }).catch((e) => {
                reject(e);
            });
        });
    }

    backFlip() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('animations', 'flip', [1, 0, 0, 0]).then(() => {
                sleep(this.breathingTime + 1000).then(() => {
                    resolve('success');
                });
            }).catch((e) => {
                reject(e);
            });
        });
    }

    rightFlip() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('animations', 'flip', [2, 0, 0, 0]).then(() => {
                sleep(this.breathingTime + 1000).then(() => {
                    resolve('success');
                });
            }).catch((e) => {
                reject(e);
            });
        });
    }

    leftFlip() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('animations', 'flip', [3, 0, 0, 0]).then(() => {
                sleep(this.breathingTime + 1000).then(() => {
                    resolve('success');
                });
            }).catch((e) => {
                reject(e);
            });
        });
    }

    takePicture() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('mediaRecord', 'picture', [0]).then(() => {
                sleep(this.breathingTime).then(() => {
                    resolve('success');
                });
            }).catch((e) => {
                reject(e);
            });
        });
    }

    listAllPictures() {
        return new Promise((resolve, reject) => {
            let imgArr = [],
                str = '',
                fileRegex = null;

            let callback = mediaObj => {
                if (mediaObj.state === 'LIS') {
                    str += mediaObj.data.toString('utf8');
                    str = str.replace('\u0000', '')
                             .replace('\u0001', '')
                             .replace('\u0002', '')
                             .replace('\u0003', '');

                    if (str.toLowerCase().indexOf('end of transfer') >= 0) {
                        imgArr = str.match(fileRegex) || [];
                        debug(imgArr);
                        this.droneController.removeListener('media-data', callback);
                        sleep(this.breathingTime).then(() => {
                            resolve(imgArr);
                        });
                    }
                }
            };

            if (!this.dirName) {
                this._mediaDir().then(dir => {
                   this.dirName = dir;
                    fileRegex = new RegExp('(' + this.dirName + '_[A-Z0-9_+\-]*.jpg)', 'g');
                    this.droneController.on('media-data', callback);
                    this.droneController.sendMediaCommand('LIS', '/internal_000/' + this.dirName + '/media').then(() => {
                    }).catch((e) => {
                        reject(e);
                    });
                }).catch((e) => {
                    reject(e);
                });
            } else {
                this.droneController.on('media-data', callback);
                this.droneController.sendMediaCommand('LIS', '/internal_000/' + this.dirName + '/media').then(() => {
                }).catch((e) => {
                    reject(e);
                });
            }
        });
    }

    downloadPicture(name, downloadPath) {
        return new Promise((resolve, reject) => {
            let stream = this.fs.createWriteStream(downloadPath + '/' + name);

            let callback = mediaObj => {
                if (mediaObj.state === 'GET' || mediaObj.state === 'MD5 OK') {
                    let dataStr = mediaObj.data.toString('utf8');

                    if (dataStr.toLowerCase().indexOf('end of transfer') >= 0) {
                        debug('Closing the stream');
                        stream.end();
                        this.droneController.removeListener('media-data', callback);
                        sleep(this.breathingTime).then(() => {
                            resolve('success');
                        });
                    } else if (dataStr.indexOf('MD5') >= 0) {
                        debug('Packet ended');
                        this.droneController.sendMediaCommand('MD5 OK', '')
                                            .then(() => {})
                                            .catch((e) => {
                                                reject(e);
                                            });
                    } else {
                        stream.write(mediaObj.data.slice(1));
                    }
                }

            };

            if (!this.dirName) {
                this._mediaDir().then(dir => {
                    this.dirName = dir;
                    this.droneController.on('media-data', callback);
                    this.droneController.sendMediaCommand('GET', '/internal_000/' + this.dirName + '/media/' + name).then(() => {
                    }).catch((e) => {
                        reject(e);
                    });
                }).catch((e) => {
                    reject(e);
                });
            } else {
                this.droneController.on('media-data', callback);
                this.droneController.sendMediaCommand('GET', '/internal_000/' + this.dirName + '/media/' + name).then(() => {
                }).catch((e) => {
                    reject(e);
                });
            }
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
                            sleep(this.breathingTime).then(() => {
                                resolve('success');
                            });
                        }
                    }
                }
            };

            if (!this.dirName) {
                this._mediaDir().then(dir => {
                    this.dirName = dir;
                    this.droneController.on('media-data', callback);

                    this.droneController.sendMediaCommand('DEL', '/internal_000/' + this.dirName + '/thumb/' + name)
                        .then(() => {})
                        .catch((e) => {
                            reject(e);
                        });
                    this.droneController.sendMediaCommand('DEL', '/internal_000/' + this.dirName + '/media/' + name)
                        .then(() => {})
                        .catch((e) => {
                            reject(e);
                        });
                }).catch((e) => {
                    reject(e);
                });
            } else {
                this.droneController.on('media-data', callback);

                this.droneController.sendMediaCommand('DEL', '/internal_000/' + this.dirName + '/thumb/' + name)
                    .then(() => {})
                    .catch((e) => {
                        reject(e);
                    });
                this.droneController.sendMediaCommand('DEL', '/internal_000/' + this.dirName + '/media/' + name)
                    .then(() => {})
                    .catch((e) => {
                        reject(e);
                    });
            }
        });
    }

    land() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('piloting', 'landing').then(() => {
                let callback = navObj => {
                    if (navObj.state === 'landed') {
                        debug('Drone has landed');
                        this.droneController.removeListener('flyingStateChanged', callback);
                        sleep(this.breathingTime).then(() => {
                            resolve('success');
                        });
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
                sleep(this.breathingTime).then(() => {
                    resolve('success');
                });
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
                        debug('Navdata: ', this.navdata);
                        observer.next(this.navdata);
                    });

                    return function () {
                        debug('ending the stream');
                    }
                });
    }

    _execManeuver(args, frequency) {
        return new Promise((resolve, reject) => {
            this.cmdInterval = setInterval(() => {
                if (frequency > 0) {
                    this.droneController
                        .sendPilotingCommand('piloting', 'maneuver', args)
                        .then()
                        .catch((e) => {
                            reject(e);
                        });
                    frequency--;
                } else {
                    clearInterval(this.cmdInterval);
                    resolve('success');
                }
            }, this.breathingTime);
        });
    }

    _isValid(val) {
        return (val >= 0 && val <= 100)
    }

    _mediaDir() {
        return new Promise((resolve, reject) => {
            let folderArr = [],
                str = '',
                folderRegex = /([A-Z])([a-z])*_([A-Z])([a-z])*/g;

            let callback = mediaObj => {
                if (mediaObj.state === 'LIS') {
                    str += mediaObj.data.toString('utf8');
                    str = str.replace('\u0000', '')
                        .replace('\u0001', '')
                        .replace('\u0002', '')
                        .replace('\u0003', '');

                    if (str.toLowerCase().indexOf('end of transfer') >= 0) {
                        folderArr = str.match(folderRegex) || [];
                        if (folderArr.length <= 0) {
                            reject('Media folder does not exist in this drone');
                        }
                        debug('Directory found: ' + folderArr[0]);
                        this.droneController.removeListener('media-data', callback);
                        sleep(this.breathingTime).then(() => {
                            resolve(folderArr[0]);
                        });
                    }
                }
            };

            this.droneController.on('media-data', callback);
            this.droneController.sendMediaCommand('LIS', '/internal_000/').then(() => {
            }).catch((e) => {
                reject(e);
            });
        });
    }
}