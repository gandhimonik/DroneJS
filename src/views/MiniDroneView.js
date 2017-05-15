import { MiniDroneController }     from '../controllers/MiniDroneController';

export class MiniDroneView {

    constructor() {
        this.droneController = new MiniDroneController();
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
}