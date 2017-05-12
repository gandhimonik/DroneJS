import { MiniDroneService }     from '../services/MiniDroneService';
import { debug }                from '../utils/debug';

import 'rxjs/add/operator/distinctUntilChanged';

export class MiniDroneController {

    constructor() {
        this.droneService = new MiniDroneService();
        this.droneCmds = require('../commands/minidrone.json');
        this.commonCmds = require('../commands/common.json');
        this.steps = 0;
        this.cmdSubscription = null;
        this.ftpSubscription = null;
    }

    connect(droneIdentifier) {
        return new Promise((resolve, reject) => {
            this.droneService.startScanning().then(() => {
                this.droneService.discoverDevice(droneIdentifier).then((peripheral) => {
                    this.droneService.stopScanning().then(() => {
                    }).catch((e) => {
                        reject(e);
                    });

                    this.droneService.connect(peripheral).then(() => {
                        this.droneService.updateProximity().then(() => {
                            this.droneService.discoverServices().then((services) => {
                                this.droneService.discoverCharacteristics(services).then((characteristics) => {
                                    this.droneService.identifyCharacteristics(characteristics).then(() => {
                                        this.addListeners();
                                        resolve("success");
                                    }).catch((e) => {
                                        reject(e);
                                    });
                                }).catch((e) => {
                                    reject(e);
                                });
                            }).catch((e) => {
                                reject(e);
                            });
                        }).catch((e) => {
                            reject(e);
                        });
                    }).catch((e) => {
                        reject(e);
                    });
                }).catch((e) => {
                    reject(e);
                });
            }).catch((e) => {
                reject(e);
            });
        });
    }

    checkAllStates() {
        return new Promise((resolve, reject) => {
            let cmd = this.genCommonCmds("allStates");
            this.droneService.sendNavCommand(cmd).then(() => {
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    sendPilotingCommand(categoryName, cmdName, args) {
        return new Promise((resolve, reject) => {
            args = args || [];
            let addLength = (cmdName === 'maneuver') ? args.length + 3 : args.length;
            let cmd = this.genMiniDroneCmds(categoryName, cmdName, args, addLength);
            this.droneService.sendNavCommand(cmd).then(() => {
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            this.droneService.disconnect().then(() => {
                this.cmdSubscription.unsubscribe();
                resolve("success");
            }).catch((e) => {
                reject(e);
            });
        });
    }

    addListeners() {
        this.cmdSubscription = this.droneService.cmdObservable
                                    .distinctUntilChanged()
                                    .subscribe((data) => {
                                            data = data.split('+');
                                            let dataStr = '';

                                            for(let j = 0; j < data.length; j++) {
                                                dataStr += data[j] + ' ';
                                            }
                                            debug('on -> data ');
                                            debug(dataStr);
                                    },
                                    err => debug(err),
                                    () => debug('complete'));
    }

    genMiniDroneCmds(categoryName, cmdName, args, addLength) {
        let baseSize = 6,
            totalSize = (args) ? baseSize + addLength : baseSize,
            buffer = Buffer.alloc(totalSize),
            offset = 0,
            categoryId,
            cmdId;

        buffer.writeUInt8(2, offset++);
        buffer.writeUInt8(++this.steps, offset++);
        buffer.writeUInt8(this.droneCmds.project.id, offset++);

        switch (cmdName) {
            case "flatTrim":
            case "takeOff":
            case "landing":
            case "emergency":
            case "maneuver":
            case "flip":
            case "picture":
                categoryId = this.droneCmds.project.categories
                .filter(category => category.name === categoryName)
                .pop().id;
                cmdId = this.droneCmds.project.categories
                    .filter(category => category.name === categoryName)
                    .map(category => {
                        return category.cmd.filter(cmdType => cmdType.name === cmdName);
                    })
                    .pop().pop().id;
                buffer.writeUInt8(categoryId, offset++);
                buffer.writeUInt16LE(cmdId, offset);
                offset += 2;
                break;

            default:
                break;
        }

        switch (cmdName) {
            case "maneuver":
                args.forEach((value, idx, array) => {
                    if (idx === array.length - 1) {
                        buffer.writeUInt32LE(value, offset);
                    } else {
                        buffer.writeInt8(value, offset++);
                    }
                });
                break;

            case "flip":
            case "picture":
                args.forEach(value => {
                    buffer.writeUInt8(value, offset++);
                });
                break;
        }

        return buffer;
    }

    genCommonCmds(cmdName) {
        let buffer = Buffer.alloc(6),
            offset = 0;

        buffer.writeInt8(2, offset++);
        buffer.writeInt8(++this.steps, offset++);
        buffer.writeInt8(this.commonCmds.project.id, offset++);

        switch (cmdName) {
            case "allStates" :
                let categoryId = this.commonCmds.project.class
                                .filter(category => category.name === "common")
                                .pop().id;
                let cmdId = this.commonCmds.project.class
                                .filter(category => category.name === "common")
                                .map(category => {
                                    return category.cmd.filter(cmdType => cmdType.name === cmdName);
                                })
                                .pop().pop().id;
                buffer.writeInt8(categoryId, offset++);
                buffer.writeUInt16LE(cmdId, offset);
                break;

            default:
                break;
        }

        return buffer;
    }
}