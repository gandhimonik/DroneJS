'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MiniDroneView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MiniDroneController = require('../controllers/MiniDroneController');

var _Observable = require('rxjs/Observable');

var _debug = require('../utils/debug');

var _sleep = require('../utils/sleep');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MiniDroneView = exports.MiniDroneView = function () {
    function MiniDroneView() {
        _classCallCheck(this, MiniDroneView);

        this.droneController = new _MiniDroneController.MiniDroneController();
        this.navdata = {};
        this.fs = require('fs');
        this.breathingTime = 200;
        this.cmdInterval = 0;
        this.dirName = null;
    }

    _createClass(MiniDroneView, [{
        key: 'enableLogging',
        value: function enableLogging(dir) {
            return new Promise(function (resolve, reject) {
                try {
                    (0, _debug.startLogging)(dir);
                    resolve('success');
                } catch (e) {
                    reject(e);
                }
            });
        }
    }, {
        key: 'connect',
        value: function connect(droneIdentifier) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.droneController.connect(droneIdentifier).then(function () {
                    (0, _debug.debug)('Drone connected successfully');
                    (0, _sleep.sleep)(_this.breathingTime).then(function () {
                        resolve('success');
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'checkAllStates',
        value: function checkAllStates() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.droneController.checkAllStates().then(function () {
                    (0, _sleep.sleep)(_this2.breathingTime).then(function () {
                        resolve('success');
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'flatTrim',
        value: function flatTrim() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.droneController.sendPilotingCommand('piloting', 'flatTrim').then(function () {
                    (0, _sleep.sleep)(_this3.breathingTime).then(function () {
                        resolve('success');
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'takeOff',
        value: function takeOff() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                _this4.droneController.sendPilotingCommand('piloting', 'takeOff').then(function () {
                    var callback = function callback(navObj) {
                        if (navObj.state === 'hovering') {
                            (0, _debug.debug)('Drone has took off');
                            _this4.droneController.removeListener('flyingStateChanged', callback);
                            (0, _sleep.sleep)(_this4.breathingTime).then(function () {
                                resolve('success');
                            });
                        } else if (navObj.state === 'takingoff') {
                            (0, _debug.debug)('sending flat trim');
                            _this4.flatTrim();
                        }
                    };

                    _this4.droneController.on('flyingStateChanged', callback);
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'turnLeft',
        value: function turnLeft(intensity, frequency) {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                if (!_this5._isValid(intensity)) {
                    reject('Error: Value for intensity should be between 0 and 100');
                }
                intensity -= 100;

                var args = [0, 0, 0, intensity, 0, 0];
                _this5._execManeuver(args, frequency).then(function () {
                    resolve('success');
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'turnRight',
        value: function turnRight(intensity, frequency) {
            var _this6 = this;

            return new Promise(function (resolve, reject) {
                if (!_this6._isValid(intensity)) {
                    reject('Error: Value for intensity should be between 0 and 100');
                }

                var args = [0, 0, 0, intensity, 0, 0];
                _this6._execManeuver(args, frequency).then(function () {
                    resolve('success');
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'backward',
        value: function backward(intensity, frequency) {
            var _this7 = this;

            return new Promise(function (resolve, reject) {
                if (!_this7._isValid(intensity)) {
                    reject('Error: Value for intensity should be between 0 and 100');
                }
                intensity -= 100;

                var args = [1, 0, intensity, 0, 0, 0];
                _this7._execManeuver(args, frequency).then(function () {
                    resolve('success');
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'forward',
        value: function forward(intensity, frequency) {
            var _this8 = this;

            return new Promise(function (resolve, reject) {
                if (!_this8._isValid(intensity)) {
                    reject('Error: Value for intensity should be between 0 and 100');
                }

                var args = [1, 0, intensity, 0, 0, 0];
                _this8._execManeuver(args, frequency).then(function () {
                    resolve('success');
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'left',
        value: function left(intensity, frequency) {
            var _this9 = this;

            return new Promise(function (resolve, reject) {
                if (!_this9._isValid(intensity)) {
                    reject('Error: Value for intensity should be between 0 and 100');
                }
                intensity -= 100;

                var args = [1, intensity, 0, 0, 0, 0];
                _this9._execManeuver(args, frequency).then(function () {
                    resolve('success');
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'right',
        value: function right(intensity, frequency) {
            var _this10 = this;

            return new Promise(function (resolve, reject) {
                if (!_this10._isValid(intensity)) {
                    reject('Error: Value for intensity should be between 0 and 100');
                }

                var args = [1, intensity, 0, 0, 0, 0];
                _this10._execManeuver(args, frequency).then(function () {
                    resolve('success');
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'down',
        value: function down(intensity, frequency) {
            var _this11 = this;

            return new Promise(function (resolve, reject) {
                if (!_this11._isValid(intensity)) {
                    reject('Error: Value for intensity should be between 0 and 100');
                }
                intensity -= 100;

                var args = [0, 0, 0, 0, intensity, 0];
                _this11._execManeuver(args, frequency).then(function () {
                    resolve('success');
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'up',
        value: function up(intensity, frequency) {
            var _this12 = this;

            return new Promise(function (resolve, reject) {
                if (!_this12._isValid(intensity)) {
                    reject('Error: Value for intensity should be between 0 and 100');
                }

                var args = [0, 0, 0, 0, intensity, 0];
                _this12._execManeuver(args, frequency).then(function () {
                    resolve('success');
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'frontFlip',
        value: function frontFlip() {
            var _this13 = this;

            return new Promise(function (resolve, reject) {
                _this13.droneController.sendPilotingCommand('animations', 'flip', [0, 0, 0, 0]).then(function () {
                    (0, _sleep.sleep)(_this13.breathingTime + 1000).then(function () {
                        resolve('success');
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'backFlip',
        value: function backFlip() {
            var _this14 = this;

            return new Promise(function (resolve, reject) {
                _this14.droneController.sendPilotingCommand('animations', 'flip', [1, 0, 0, 0]).then(function () {
                    (0, _sleep.sleep)(_this14.breathingTime + 1000).then(function () {
                        resolve('success');
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'rightFlip',
        value: function rightFlip() {
            var _this15 = this;

            return new Promise(function (resolve, reject) {
                _this15.droneController.sendPilotingCommand('animations', 'flip', [2, 0, 0, 0]).then(function () {
                    (0, _sleep.sleep)(_this15.breathingTime + 1000).then(function () {
                        resolve('success');
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'leftFlip',
        value: function leftFlip() {
            var _this16 = this;

            return new Promise(function (resolve, reject) {
                _this16.droneController.sendPilotingCommand('animations', 'flip', [3, 0, 0, 0]).then(function () {
                    (0, _sleep.sleep)(_this16.breathingTime + 1000).then(function () {
                        resolve('success');
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'takePicture',
        value: function takePicture() {
            var _this17 = this;

            return new Promise(function (resolve, reject) {
                _this17.droneController.sendPilotingCommand('mediaRecord', 'picture', [0]).then(function () {
                    (0, _sleep.sleep)(_this17.breathingTime).then(function () {
                        resolve('success');
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'listAllPictures',
        value: function listAllPictures() {
            var _this18 = this;

            return new Promise(function (resolve, reject) {
                var imgArr = [],
                    str = '',
                    fileRegex = null;

                var callback = function callback(mediaObj) {
                    if (mediaObj.state === 'LIS') {
                        str += mediaObj.data.toString('utf8');
                        str = str.replace('\0', '').replace('\x01', '').replace('\x02', '').replace('\x03', '');

                        if (str.toLowerCase().indexOf('end of transfer') >= 0) {
                            imgArr = str.match(fileRegex) || [];
                            (0, _debug.debug)(imgArr);
                            _this18.droneController.removeListener('media-data', callback);
                            (0, _sleep.sleep)(_this18.breathingTime).then(function () {
                                resolve(imgArr);
                            });
                        }
                    }
                };

                if (!_this18.dirName) {
                    _this18._mediaDir().then(function (dir) {
                        _this18.dirName = dir;
                        fileRegex = new RegExp('(' + _this18.dirName + '_[A-Z0-9_+\-]*.jpg)', 'g');
                        _this18.droneController.on('media-data', callback);
                        _this18.droneController.sendMediaCommand('LIS', '/internal_000/' + _this18.dirName + '/media').then(function () {}).catch(function (e) {
                            reject(e);
                        });
                    }).catch(function (e) {
                        reject(e);
                    });
                } else {
                    _this18.droneController.on('media-data', callback);
                    _this18.droneController.sendMediaCommand('LIS', '/internal_000/' + _this18.dirName + '/media').then(function () {}).catch(function (e) {
                        reject(e);
                    });
                }
            });
        }
    }, {
        key: 'downloadPicture',
        value: function downloadPicture(name, downloadPath) {
            var _this19 = this;

            return new Promise(function (resolve, reject) {
                var stream = _this19.fs.createWriteStream(downloadPath + '/' + name);

                var callback = function callback(mediaObj) {
                    if (mediaObj.state === 'GET' || mediaObj.state === 'MD5 OK') {
                        var dataStr = mediaObj.data.toString('utf8');

                        if (dataStr.toLowerCase().indexOf('end of transfer') >= 0) {
                            (0, _debug.debug)('Closing the stream');
                            stream.end();
                            _this19.droneController.removeListener('media-data', callback);
                            (0, _sleep.sleep)(_this19.breathingTime).then(function () {
                                resolve('success');
                            });
                        } else if (dataStr.indexOf('MD5') >= 0) {
                            (0, _debug.debug)('Packet ended');
                            _this19.droneController.sendMediaCommand('MD5 OK', '').then(function () {}).catch(function (e) {
                                reject(e);
                            });
                        } else {
                            stream.write(mediaObj.data.slice(1));
                        }
                    }
                };

                if (!_this19.dirName) {
                    _this19._mediaDir().then(function (dir) {
                        _this19.dirName = dir;
                        _this19.droneController.on('media-data', callback);
                        _this19.droneController.sendMediaCommand('GET', '/internal_000/' + _this19.dirName + '/media/' + name).then(function () {}).catch(function (e) {
                            reject(e);
                        });
                    }).catch(function (e) {
                        reject(e);
                    });
                } else {
                    _this19.droneController.on('media-data', callback);
                    _this19.droneController.sendMediaCommand('GET', '/internal_000/' + _this19.dirName + '/media/' + name).then(function () {}).catch(function (e) {
                        reject(e);
                    });
                }
            });
        }
    }, {
        key: 'deletePicture',
        value: function deletePicture(name) {
            var _this20 = this;

            return new Promise(function (resolve, reject) {
                var confirmArr = [];

                var callback = function callback(mediaObj) {
                    if (mediaObj.state === 'DEL') {
                        var str = mediaObj.data.toString('utf8');
                        if (str.toLowerCase().indexOf('delete successful') >= 0) {
                            (0, _debug.debug)(str);
                            confirmArr.push(str);

                            if (confirmArr.length === 2) {
                                _this20.droneController.removeListener('media-data', callback);
                                (0, _sleep.sleep)(_this20.breathingTime).then(function () {
                                    resolve('success');
                                });
                            }
                        }
                    }
                };

                if (!_this20.dirName) {
                    _this20._mediaDir().then(function (dir) {
                        _this20.dirName = dir;
                        _this20.droneController.on('media-data', callback);

                        _this20.droneController.sendMediaCommand('DEL', '/internal_000/' + _this20.dirName + '/thumb/' + name).then(function () {}).catch(function (e) {
                            reject(e);
                        });
                        _this20.droneController.sendMediaCommand('DEL', '/internal_000/' + _this20.dirName + '/media/' + name).then(function () {}).catch(function (e) {
                            reject(e);
                        });
                    }).catch(function (e) {
                        reject(e);
                    });
                } else {
                    _this20.droneController.on('media-data', callback);

                    _this20.droneController.sendMediaCommand('DEL', '/internal_000/' + _this20.dirName + '/thumb/' + name).then(function () {}).catch(function (e) {
                        reject(e);
                    });
                    _this20.droneController.sendMediaCommand('DEL', '/internal_000/' + _this20.dirName + '/media/' + name).then(function () {}).catch(function (e) {
                        reject(e);
                    });
                }
            });
        }
    }, {
        key: 'land',
        value: function land() {
            var _this21 = this;

            return new Promise(function (resolve, reject) {
                _this21.droneController.sendPilotingCommand('piloting', 'landing').then(function () {
                    var callback = function callback(navObj) {
                        if (navObj.state === 'landed') {
                            (0, _debug.debug)('Drone has landed');
                            _this21.droneController.removeListener('flyingStateChanged', callback);
                            (0, _sleep.sleep)(_this21.breathingTime).then(function () {
                                resolve('success');
                            });
                        }
                    };

                    _this21.droneController.on('flyingStateChanged', callback);
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            var _this22 = this;

            return new Promise(function (resolve, reject) {
                _this22.droneController.disconnect().then(function () {
                    (0, _debug.debug)('Drone disconnected successfully');
                    (0, _sleep.sleep)(_this22.breathingTime).then(function () {
                        resolve('success');
                    });
                }).catch(function (e) {
                    reject(e);
                });
            });
        }
    }, {
        key: 'getNavDataStream',
        value: function getNavDataStream() {
            var _this23 = this;

            return _Observable.Observable.create(function (observer) {
                (0, _debug.debug)('Creating observer...');
                _this23.droneController.on('data', function (navInfo) {
                    _this23.navdata[navInfo.name] = {};
                    navInfo.args.forEach(function (arg) {
                        _this23.navdata[navInfo.name][arg.name] = arg.value;
                    });
                    (0, _debug.debug)('Navdata: ', _this23.navdata);
                    observer.next(_this23.navdata);
                });

                return function () {
                    (0, _debug.debug)('ending the stream');
                };
            });
        }
    }, {
        key: '_execManeuver',
        value: function _execManeuver(args, frequency) {
            var _this24 = this;

            return new Promise(function (resolve, reject) {
                _this24.cmdInterval = setInterval(function () {
                    if (frequency > 0) {
                        _this24.droneController.sendPilotingCommand('piloting', 'maneuver', args).then().catch(function (e) {
                            reject(e);
                        });
                        frequency--;
                    } else {
                        clearInterval(_this24.cmdInterval);
                        resolve('success');
                    }
                }, _this24.breathingTime);
            });
        }
    }, {
        key: '_isValid',
        value: function _isValid(val) {
            return val >= 0 && val <= 100;
        }
    }, {
        key: '_mediaDir',
        value: function _mediaDir() {
            var _this25 = this;

            return new Promise(function (resolve, reject) {
                var folderArr = [],
                    str = '',
                    folderRegex = /([A-Z])([a-z])*_([A-Z])([a-z])*/g;

                var callback = function callback(mediaObj) {
                    if (mediaObj.state === 'LIS') {
                        str += mediaObj.data.toString('utf8');
                        str = str.replace('\0', '').replace('\x01', '').replace('\x02', '').replace('\x03', '');

                        if (str.toLowerCase().indexOf('end of transfer') >= 0) {
                            folderArr = str.match(folderRegex) || [];
                            if (folderArr.length <= 0) {
                                reject('Media folder does not exist in this drone');
                            }
                            (0, _debug.debug)('Directory found: ' + folderArr[0]);
                            _this25.droneController.removeListener('media-data', callback);
                            (0, _sleep.sleep)(_this25.breathingTime).then(function () {
                                resolve(folderArr[0]);
                            });
                        }
                    }
                };

                _this25.droneController.on('media-data', callback);
                _this25.droneController.sendMediaCommand('LIS', '/internal_000/').then(function () {}).catch(function (e) {
                    reject(e);
                });
            });
        }
    }]);

    return MiniDroneView;
}();