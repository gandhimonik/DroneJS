import { MiniDroneController }     from '../controllers/MiniDroneController';
import { Observable }              from 'rxjs/Observable';
import { debug }                   from '../utils/debug';

export class MiniDroneView {

    constructor() {
        this.droneController = new MiniDroneController();
        this.navdata = {};
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
                resolve("success");
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
                resolve("success");
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



    land() {
        return new Promise((resolve, reject) => {
            this.droneController.sendPilotingCommand('piloting', 'landing').then(() => {
                resolve("success");
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
                        // debug(this.navdata);
                        observer.next(this.navdata);
                    });

                    return function () {
                        debug('ending the stream');
                    }
                });
    }
}