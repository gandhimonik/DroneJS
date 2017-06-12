'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MiniDroneService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('../utils/debug');

var _Observable = require('rxjs/Observable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MiniDroneService = exports.MiniDroneService = function () {
    function MiniDroneService() {
        _classCallCheck(this, MiniDroneService);

        this.drone = null;
        this.cmdService = null;
        this.ftpGetService = null;
        this.ftpHandlingService = null;
        this.cmdObservable = null;
        this.ftpObservable = null;
        this.noble = require('noble');
    }

    _createClass(MiniDroneService, [{
        key: 'startScanning',
        value: function startScanning() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                try {
                    _this.noble.on('scanStart', function () {
                        (0, _debug.debug)('scanning devices...');
                        resolve("success");
                    });

                    _this.noble.on('stateChange', function (state) {
                        try {
                            state === 'poweredOn' ? _this.noble.startScanning() : _this.noble.stopScanning();
                        } catch (e) {
                            reject(e);
                        }
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'stopScanning',
        value: function stopScanning() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                try {
                    _this2.noble.on('scanStop', function () {
                        (0, _debug.debug)('scanning stopped...');
                        resolve("success");
                    });

                    _this2.noble.stopScanning();
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'discoverDevice',
        value: function discoverDevice(droneIdentifier) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                try {
                    _this3.noble.on('discover', function (peripheral) {
                        if (peripheral.advertisement.localName && peripheral.advertisement.localName.includes(droneIdentifier) || peripheral.advertisement.uuid === droneIdentifier) {
                            (0, _debug.debug)('peripheral discovered: ' + peripheral.advertisement.localName + ' at promixity: ' + peripheral.rssi);
                            resolve(peripheral);
                        }
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'connect',
        value: function connect(peripheral) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                var self = _this4;
                try {
                    peripheral.on('connect', function () {
                        (0, _debug.debug)('handshake completed...');
                        self.drone = peripheral;
                        resolve("success");
                    });

                    peripheral.connect();
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'updateProximity',
        value: function updateProximity() {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                try {
                    _this5.drone.on('rssiUpdate', function (rssi) {
                        (0, _debug.debug)("proximity updated to: " + rssi);
                        resolve("success");
                    });

                    _this5.drone.updateRssi();
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'discoverServices',
        value: function discoverServices() {
            var _this6 = this;

            return new Promise(function (resolve, reject) {
                try {
                    _this6.drone.on('servicesDiscover', function (services) {
                        (0, _debug.debug)('services found: ' + services);
                        resolve(services);
                    });

                    _this6.drone.discoverServices();
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'discoverCharacteristics',
        value: function discoverCharacteristics(services) {
            return new Promise(function (resolve, reject) {
                try {
                    var ids = [],
                        chars = [];
                    services.forEach(function (service, idx, array) {
                        service.on('characteristicsDiscover', function (characteristics) {
                            (0, _debug.debug)('characteristics found: ' + characteristics);
                            chars = chars.concat(characteristics);
                            ids.push(idx);

                            if (ids.length === array.length) {
                                resolve(chars);
                            }
                        });
                        service.discoverCharacteristics();
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'identifyCharacteristics',
        value: function identifyCharacteristics(characteristics) {
            var _this7 = this;

            return new Promise(function (resolve, reject) {
                try {
                    var cmdChars = characteristics.filter(function (char) {
                        return char.uuid.indexOf("fa") >= 0;
                    }),
                        notifyChars = characteristics.filter(function (char) {
                        return char.uuid.indexOf("fb") >= 0;
                    }),
                        ftpChars = characteristics.filter(function (char) {
                        return char.uuid.indexOf("fd2") >= 0;
                    });

                    _this7.cmdService = cmdChars[10];
                    _this7.cmdObservable = _this7.createObservable(notifyChars);
                    _this7.ftpGetService = ftpChars[1];
                    _this7.ftpHandlingService = ftpChars[2];
                    _this7.ftpObservable = _this7.createObservable(ftpChars);

                    _this7.subscribeToNotify(notifyChars).then(function () {
                        _this7.subscribeToNotify(ftpChars).then(function () {
                            resolve('success');
                        }).catch(function (e) {
                            reject(e);
                        });
                    }).catch(function (e) {
                        reject(e);
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'subscribeToNotify',
        value: function subscribeToNotify(characteristics) {
            return new Promise(function (resolve, reject) {
                try {
                    var ids = [];
                    characteristics.forEach(function (char, idx, array) {
                        char.on('notify', function (state) {
                            // debug('on -> notify: ' + this.uuid + ': ' + state);

                            ids.push(idx);
                            if (ids.length === array.length) {
                                (0, _debug.debug)('subscribed to characteristics...');
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
    }, {
        key: 'createObservable',
        value: function createObservable(characteristics) {
            return _Observable.Observable.create(function (observer) {
                (0, _debug.debug)('Creating observable...');
                characteristics.forEach(function (char) {
                    char.on('data', function (data) {
                        var arr = char.uuid.indexOf('fb') >= 0 ? Array.prototype.slice.call(data, 0).join('+') : data;
                        observer.next(arr);
                    });
                });

                return function () {
                    (0, _debug.debug)('observable disposed');
                };
            });
        }
    }, {
        key: 'sendNavCommand',
        value: function sendNavCommand(buffer) {
            var _this8 = this;

            return new Promise(function (resolve, reject) {
                try {
                    (0, _debug.debug)('Sending Command...');
                    _this8.cmdService.write(buffer, false);
                    resolve("success");
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'sendFTPCommand',
        value: function sendFTPCommand(buffer, thruGetService) {
            var _this9 = this;

            return new Promise(function (resolve, reject) {
                try {
                    (0, _debug.debug)('Sending FTP Command...');
                    if (thruGetService) {
                        _this9.ftpGetService.write(buffer, false);
                    } else {
                        _this9.ftpHandlingService.write(buffer, false);
                    }
                    resolve("success");
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            var _this10 = this;

            return new Promise(function (resolve, reject) {
                try {
                    (0, _debug.debug)('disconnecting drone...');
                    _this10.drone.disconnect();
                    resolve("success");
                } catch (e) {
                    reject(e);
                }
            });
        }
    }]);

    return MiniDroneService;
}();