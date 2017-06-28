'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MiniDroneController = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MiniDroneService = require('../services/MiniDroneService');

var _debug = require('../utils/debug');

var _events = require('events');

require('rxjs/add/operator/distinctUntilChanged');

require('rxjs/add/operator/filter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MiniDroneController = exports.MiniDroneController = function (_EventEmitter) {
    _inherits(MiniDroneController, _EventEmitter);

    function MiniDroneController() {
        _classCallCheck(this, MiniDroneController);

        var _this = _possibleConstructorReturn(this, (MiniDroneController.__proto__ || Object.getPrototypeOf(MiniDroneController)).call(this));

        _this.droneService = new _MiniDroneService.MiniDroneService();
        _this.droneCmds = require('../commands/minidrone.json');
        _this.commonCmds = require('../commands/common.json');
        _this.steps = 0;
        _this.cmdSubscription = null;
        _this.ftpSubscription = null;
        _this.mediaState = '';
        _this.md5PacketLength = 37;
        _this.lastPacketLength = 34;
        return _this;
    }

    _createClass(MiniDroneController, [{
        key: 'connect',
        value: function connect(droneIdentifier) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.droneService.startScanning().then(function () {
                    _this2.droneService.discoverDevice(droneIdentifier).then(function (peripheral) {
                        _this2.droneService.stopScanning().then(function () {}).catch(function (e) {
                            reject(e);
                        });

                        _this2.droneService.connect(peripheral).then(function () {
                            _this2.droneService.updateProximity().then(function () {
                                _this2.droneService.discoverServices().then(function (services) {
                                    _this2.droneService.discoverCharacteristics(services).then(function (characteristics) {
                                        _this2.droneService.identifyCharacteristics(characteristics).then(function () {
                                            _this2.addListeners();
                                            resolve("success");
                                        }).catch(function (e) {
                                            reject(e);
                                        });
                                    }).catch(function (e) {
                                        reject(e);
                                    });
                                }).catch(function (e) {
                                    reject(e);
                                });
                            }).catch(function (e) {
                                reject(e);
                            });
                        }).catch(function (e) {
                            reject(e);
                        });
                    }).catch(function (e) {
                        reject(e);
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'checkAllStates',
        value: function checkAllStates() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var cmd = _this3.genCommonCmds("allStates");
                _this3.droneService.sendNavCommand(cmd).then(function () {
                    resolve("success");
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'sendPilotingCommand',
        value: function sendPilotingCommand(categoryName, cmdName, args) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                args = args || [];
                var addLength = cmdName === 'maneuver' ? args.length + 3 : args.length;
                var cmd = _this4.genMiniDroneCmds(categoryName, cmdName, args, addLength);
                _this4.droneService.sendNavCommand(cmd).then(function () {
                    resolve("success");
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'sendMediaCommand',
        value: function sendMediaCommand(cmdName, param) {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                var thruGetService = false,
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

                _this5.droneService.sendFTPCommand(buffer, thruGetService).then(function () {
                    _this5.mediaState = cmdName;
                    resolve("success");
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            var _this6 = this;

            return new Promise(function (resolve, reject) {
                _this6.droneService.disconnect().then(function () {
                    _this6.cmdSubscription.unsubscribe();
                    _this6.ftpSubscription.unsubscribe();
                    resolve("success");
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'addListeners',
        value: function addListeners() {
            var _this7 = this;

            this.cmdSubscription = this.droneService.cmdObservable.distinctUntilChanged().subscribe(function (data) {
                var navInfo = void 0;

                data = data.split('+');

                navInfo = _this7.parseData(data);
                _this7.emit('data', navInfo);

                if (navInfo.name === 'flyingStateChanged') {
                    var navObj = {};
                    navInfo.args.forEach(function (arg) {
                        navObj[arg.name] = arg.value;
                    });
                    _this7.emit(navInfo.name, navObj);
                }
            }, function (err) {
                return (0, _debug.debug)(err);
            }, function () {
                return (0, _debug.debug)('complete');
            });

            var ignoreBytes = 0;
            this.ftpSubscription = this.droneService.ftpObservable.filter(function (data) {
                var str = data.toString('utf8');

                if (str.toLowerCase().indexOf('end of transfer') >= 0) {
                    ignoreBytes = _this7.lastPacketLength;
                    return true;
                } else if (str.indexOf('MD5') >= 0) {
                    ignoreBytes = _this7.md5PacketLength;
                    ignoreBytes -= data.length;
                    return true;
                } else if (ignoreBytes) {
                    ignoreBytes -= data.length;
                    return false;
                }

                return ignoreBytes <= 0;
            }).subscribe(function (data) {
                _this7.emit('media-data', {
                    state: _this7.mediaState,
                    data: data
                });
            }, function (err) {
                return (0, _debug.debug)(err);
            }, function () {
                return (0, _debug.debug)('complete');
            });
        }
    }, {
        key: 'parseData',
        value: function parseData(data) {
            var categoryName = void 0,
                navInfo = void 0,
                categoryId = void 0,
                cmdId = void 0,
                offset = 0,
                cmds = void 0;

            if (!data || !data.length) {
                return;
            }

            (0, _debug.debug)(data);

            data.shift();
            data.shift();

            data = Buffer.from(data);
            cmds = data.readUInt8(offset) === this.droneCmds.project.id ? this.droneCmds : this.commonCmds;

            offset++;

            categoryId = data.readUInt8(offset);
            offset++;
            cmdId = data.readUInt16LE(offset);
            offset += 2;

            categoryName = cmds.project.categories.filter(function (category) {
                return category.id === categoryId;
            }).pop().name;
            navInfo = cmds.project.categories.filter(function (category) {
                return category.name === categoryName;
            }).map(function (category) {
                return category.cmd.filter(function (cmdType) {
                    return cmdType.id === cmdId;
                }).map(function (cmdType) {
                    return { name: cmdType.name, args: cmdType.arg };
                });
            }).pop().pop();

            navInfo.args = this.getValuesByType(data, offset, navInfo.args);

            return navInfo;
        }
    }, {
        key: 'getValuesByType',
        value: function getValuesByType(buffer, offset, args) {
            var values = [];

            args = args || [];
            args = !Array.isArray(args) ? [args] : args;

            args.forEach(function (arg) {
                var obj = {};
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
                        var id = buffer.readUInt8(offset);
                        obj.value = arg.values.filter(function (valObj) {
                            return valObj.value === id;
                        }).pop().name;
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
    }, {
        key: 'genMiniDroneCmds',
        value: function genMiniDroneCmds(categoryName, cmdName, args, addLength) {
            var baseSize = 6,
                totalSize = args ? baseSize + addLength : baseSize,
                buffer = Buffer.alloc(totalSize),
                offset = 0,
                categoryId = void 0,
                cmdId = void 0;

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
                    categoryId = this.droneCmds.project.categories.filter(function (category) {
                        return category.name === categoryName;
                    }).pop().id;
                    cmdId = this.droneCmds.project.categories.filter(function (category) {
                        return category.name === categoryName;
                    }).map(function (category) {
                        return category.cmd.filter(function (cmdType) {
                            return cmdType.name === cmdName;
                        });
                    }).pop().pop().id;
                    buffer.writeUInt8(categoryId, offset++);
                    buffer.writeUInt16LE(cmdId, offset);
                    offset += 2;
                    break;

                default:
                    break;
            }

            switch (cmdName) {
                case "maneuver":
                    args.forEach(function (value, idx, array) {
                        if (idx === array.length - 1) {
                            buffer.writeUInt32LE(value, offset);
                        } else {
                            buffer.writeInt8(value, offset++);
                        }
                    });
                    break;

                case "flip":
                case "picture":
                    args.forEach(function (value) {
                        buffer.writeUInt8(value, offset++);
                    });
                    break;
            }

            return buffer;
        }
    }, {
        key: 'genCommonCmds',
        value: function genCommonCmds(cmdName) {
            var buffer = Buffer.alloc(6),
                offset = 0;

            buffer.writeInt8(2, offset++);
            buffer.writeInt8(++this.steps, offset++);
            buffer.writeInt8(this.commonCmds.project.id, offset++);

            switch (cmdName) {
                case "allStates":
                    var categoryId = this.commonCmds.project.categories.filter(function (category) {
                        return category.name === "common";
                    }).pop().id;
                    var cmdId = this.commonCmds.project.categories.filter(function (category) {
                        return category.name === "common";
                    }).map(function (category) {
                        return category.cmd.filter(function (cmdType) {
                            return cmdType.name === cmdName;
                        });
                    }).pop().pop().id;
                    buffer.writeInt8(categoryId, offset++);
                    buffer.writeUInt16LE(cmdId, offset);
                    break;

                default:
                    break;
            }

            return buffer;
        }
    }]);

    return MiniDroneController;
}(_events.EventEmitter);