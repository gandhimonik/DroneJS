import { MiniDroneController }     from '../controllers/MiniDroneController';
import { debug }                from '../utils/debug';

export class MiniDroneController {

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