import { MiniDroneService }     from '../services/MiniDroneService';
import { debug }                from '../utils/debug';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';

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
            this.droneService.sendDroneCommand(cmd).then(() => {
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
                                .subscribe((data) => {
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
                                    return category.cmd.filter(cmdType => cmdType.name === "allStates");
                                })
                                .pop().pop().id;
                buffer.writeUInt16LE(categoryId, offset);
                offset += 2;
                buffer.writeInt8(cmdId, offset++);

        }

        return buffer;
    }
}