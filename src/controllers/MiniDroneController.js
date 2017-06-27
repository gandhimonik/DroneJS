import { MiniDroneService }     from '../services/MiniDroneService';
import { debug }                from '../utils/debug';
import { EventEmitter }         from 'events';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';

export class MiniDroneController extends EventEmitter {

    constructor() {
        super();
        this.droneService = new MiniDroneService();
        this.droneCmds = require('../commands/minidrone.json');
        this.commonCmds = require('../commands/common.json');
        this.steps = 0;
        this.cmdSubscription = null;
        this.ftpSubscription = null;
        this.mediaState = '';
        this.md5PacketLength = 37;
        this.lastPacketLength = 34;
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

    sendMediaCommand(cmdName, param) {
        return new Promise((resolve, reject) => {
            let thruGetService = false,
                buffer = Buffer.alloc(cmdName.length + param.length + 2),
                offset = 0;

            if (cmdName.startsWith('MD5')) {
                thruGetService = true;
            }

            if (!thruGetService) {
                buffer.writeUInt8(3, offset++);
            }

            buffer.write(cmdName, offset, cmdName.length, 'utf8');
            offset += cmdName.length;

            if (param) {
                buffer.write(param, offset, param.length, 'utf8');
                offset += param.length;
            }

            if (!thruGetService) {
                buffer.writeUInt8(0, offset);
            }

            this.droneService.sendFTPCommand(buffer, thruGetService).then(() => {
                this.mediaState = cmdName;
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
                this.ftpSubscription.unsubscribe();
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
                                            let navInfo;

                                            data = data.split('+');

                                            navInfo = this.parseData(data);
                                            this.emit('data', navInfo);

                                            if (navInfo.name === 'flyingStateChanged') {
                                                let navObj = {};
                                                navInfo.args.forEach(arg => {
                                                    navObj[arg.name] = arg.value;
                                                });
                                                this.emit(navInfo.name, navObj);
                                            }
                                    },
                                    err => debug(err),
                                    () => debug('complete'));

        let ignoreBytes = 0;
        this.ftpSubscription = this.droneService.ftpObservable
                                    .filter(data => {
                                        let str = data.toString('utf8');

                                        if (str.toLowerCase().indexOf('end of transfer') >= 0) {
                                            ignoreBytes = this.lastPacketLength;
                                            return true;
                                        } else if (str.indexOf('MD5') >= 0) {
                                            ignoreBytes = this.md5PacketLength;
                                            ignoreBytes -= data.length;
                                            return true;
                                        } else if (ignoreBytes) {
                                            ignoreBytes -= data.length;
                                            return false;
                                        }

                                        return (ignoreBytes <= 0);
                                    })
                                    .subscribe((data) => {
                                        this.emit('media-data', {
                                            state: this.mediaState,
                                            data: data
                                        });
                                    },
                                    err => debug(err),
                                    () => debug('complete'));
    }

    parseData(data) {
        let categoryName,
            navInfo,
            categoryId,
            cmdId,
            offset = 0,
            cmds;

        if (!data || !data.length) {
            return;
        }

        debug(data);

        data.shift();
        data.shift();

        data = Buffer.from(data);
        cmds = (data.readUInt8(offset) === this.droneCmds.project.id) ? this.droneCmds : this.commonCmds;

        offset++;

        categoryId = data.readUInt8(offset);
        offset++;
        cmdId = data.readUInt16LE(offset);
        offset += 2;

        categoryName =  cmds.project.categories
                            .filter(category => category.id === categoryId)
                            .pop().name;
        navInfo = cmds.project.categories
                            .filter(category => category.name === categoryName)
                            .map(category => {
                                return category.cmd
                                                .filter(cmdType => cmdType.id === cmdId)
                                                .map(cmdType => {
                                                    return { name: cmdType.name, args: cmdType.arg };
                                                });
                            })
                            .pop().pop();

        navInfo.args = this.getValuesByType(data, offset, navInfo.args);
        // debug(navInfo);

        return navInfo;
    }

    getValuesByType(buffer, offset, args) {
        let values = [];

        args = args || [];
        args = (!Array.isArray(args)) ? [args] : args;

        args.forEach(arg => {
           let obj = {};
           obj.name = arg.name;
           switch (arg.type) {
               case 'u8':
                   obj.value = buffer.readUInt8(offset);
                   offset++;
                   break;

               case 'u16':
                   obj.value = buffer.readUInt16LE(offset);
                   offset += 2;
                   break;

               case 'u32':
                   obj.value = buffer.readUInt32LE(offset);
                   offset += 4;
                   break;

               case 'i8':
                   obj.value = buffer.readInt8(offset);
                   offset++;
                   break;

               case 'i16':
                   obj.value = buffer.readInt16LE(offset);
                   offset += 2;
                   break;

               case 'i32':
                   obj.value = buffer.readInt32LE(offset);
                   offset += 4;
                   break;

               case 'float':
                   obj.value = buffer.readFloatLE(offset);
                   offset += 4;
                   break;

               case 'enum':
                   let id = buffer.readUInt8(offset);
                   obj.value = arg.values
                                    .filter(valObj => valObj.value === id)
                                    .pop().name;
                   offset++;
                   break;

               case 'string':
                   obj.value = buffer.toString('utf8', offset);
                   break;
           }
           values.push(obj);
        });

        return values;
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
                let categoryId = this.commonCmds.project.categories
                                .filter(category => category.name === "common")
                                .pop().id;
                let cmdId = this.commonCmds.project.categories
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