import { expect }               from 'chai';
import { assert, spy, stub }    from 'sinon';
import { debug }                from '../../src/utils/debug';

import { MiniDroneController } from '../../src/controllers/MiniDroneController';

let miniDroneController = null,
    fakePromise,
    startScanServiceStub,
    stopScanServiceStub,
    discDeviceServiceStub,
    conServiceStub,
    upProxServiceStub,
    discServicesStub,
    discCharServiceStub,
    identifyCharServiceStub,
    sendDroneCmdServiceStub,
    disconnectServiceStub;

before(() => {
    miniDroneController = new MiniDroneController();
    fakePromise = {
        then: function(fn) {
            fn();
            return {
                catch: function() {}
            }
        },
        // catch: function() { }
    };

    startScanServiceStub = stub(miniDroneController.droneService, 'startScanning').callsFake(() => fakePromise);
    stopScanServiceStub = stub(miniDroneController.droneService, 'stopScanning').callsFake(() => fakePromise);
    discDeviceServiceStub = stub(miniDroneController.droneService, 'discoverDevice').callsFake(() => fakePromise);
    conServiceStub = stub(miniDroneController.droneService, 'connect').callsFake(() => fakePromise);
    upProxServiceStub = stub(miniDroneController.droneService, 'updateProximity').callsFake(() => fakePromise);
    discServicesStub = stub(miniDroneController.droneService, 'discoverServices').callsFake(() => fakePromise);
    discCharServiceStub = stub(miniDroneController.droneService, 'discoverCharacteristics').callsFake(() => fakePromise);
    identifyCharServiceStub = stub(miniDroneController.droneService, 'identifyCharacteristics').callsFake(() => fakePromise);
    sendDroneCmdServiceStub = stub(miniDroneController.droneService, 'sendNavCommand').callsFake(() => fakePromise);
    disconnectServiceStub = stub(miniDroneController.droneService, 'disconnect').callsFake(() => fakePromise);

    miniDroneController.droneService.cmdObservable = {
        distinctUntilChanged: function() {
            return {
                subscribe: function() {}
            }
        }
    };
});

describe("MiniDroneController", () => {

    it("test if exists", () => {
        expect(miniDroneController).to.exist;
    });

    it("test if all the properties are initialized", () => {
        expect(miniDroneController.droneService).to.exist;
        expect(miniDroneController.droneCmds).to.exist;
        expect(miniDroneController.commonCmds).to.exist;
        expect(miniDroneController.steps).to.exist;
        expect(miniDroneController.cmdSubscription).to.be.null;
        expect(miniDroneController.ftpSubscription).to.be.null;
    });

    describe("test method: connect", () => {
        it("test if exists", () => {
            expect(miniDroneController.connect).to.exist;
        });

        it("test if method is called", (done) => {
            let conSpy = spy(miniDroneController, 'connect'),
                listenerSpy = spy(miniDroneController, 'addListeners');

            miniDroneController.connect('RS_').then(value => {
                assert.called(conSpy);
                assert.called(listenerSpy);
                assert.called(startScanServiceStub);
                assert.called(stopScanServiceStub);
                assert.called(discDeviceServiceStub);
                assert.called(conServiceStub);
                assert.called(upProxServiceStub);
                assert.called(discServicesStub);
                assert.called(discCharServiceStub);
                assert.called(identifyCharServiceStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneController.connect.restore();
            miniDroneController.addListeners.restore();
        });

        it("test if method fails", (done) => {
            let conSpy = spy(miniDroneController, 'connect'),
                listenerSpy = stub(miniDroneController, 'addListeners').callsFake(() => {
                    throw new Error('failed');
                });

            miniDroneController.connect('RS_').then(value => {
                done();
            }).catch(e => {
                assert.calledOnce(conSpy);
                assert.calledOnce(listenerSpy);
                assert.called(startScanServiceStub);
                assert.called(stopScanServiceStub);
                assert.called(discDeviceServiceStub);
                assert.called(conServiceStub);
                assert.called(upProxServiceStub);
                assert.called(discServicesStub);
                assert.called(discCharServiceStub);
                assert.called(identifyCharServiceStub);
                expect(e).to.exist;
                done();
            });

            miniDroneController.connect.restore();
            miniDroneController.addListeners.restore();
        });
    });

    describe("test method: checkAllStates", () => {
        it("test if exists", () => {
            expect(miniDroneController.checkAllStates).to.exist;
        });

        it("test if method is called", (done) => {
            let statesSpy = spy(miniDroneController, 'checkAllStates'),
                genCmdSpy = spy(miniDroneController, 'genCommonCmds');

            miniDroneController.checkAllStates().then(value => {
                assert.called(statesSpy);
                assert.called(genCmdSpy);
                assert.called(sendDroneCmdServiceStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneController.checkAllStates.restore();
            miniDroneController.genCommonCmds.restore();
        });

        it("test if method fails", (done) => {
            let statesSpy = spy(miniDroneController, 'checkAllStates'),
                genCmdStub = stub(miniDroneController, 'genCommonCmds').callsFake(() => {
                    throw new Error('failed');
                });

            miniDroneController.checkAllStates().then(value => {

                done();
            }).catch(e => {
                assert.called(statesSpy);
                assert.called(genCmdStub);
                expect(e).to.exist;
                done();
            });

            miniDroneController.checkAllStates.restore();
            miniDroneController.genCommonCmds.restore();
        });
    });

    describe("test method: disconnect", () => {
        it("test if exists", () => {
            expect(miniDroneController.disconnect).to.exist;
        });

        it("test if method is called", (done) => {
            let disconSpy = spy(miniDroneController, 'disconnect');
                miniDroneController.cmdSubscription = {
                    unsubscribe: function () {
                        return true;
                    }
                };

            miniDroneController.disconnect().then(value => {
                assert.called(disconSpy);
                assert.called(disconnectServiceStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneController.disconnect.restore();
        });

        it("test if method fails", (done) => {
            let disconSpy = spy(miniDroneController, 'disconnect');
            miniDroneController.cmdSubscription = {
                unsubscribe: function () {
                    throw new Error('failed');
                }
            };

            miniDroneController.disconnect().then(value => {
                done();
            }).catch(e => {
                assert.called(disconSpy);
                assert.called(disconnectServiceStub);
                expect(e).to.exist;
                done();
            });

            miniDroneController.disconnect.restore();
        });
    });

    describe("test method: addListeners", () => {
        it("test if exists", () => {
            expect(miniDroneController.addListeners).to.exist;
        });

        it("test if method is called", (done) => {
            let listenerSpy = spy(miniDroneController, 'addListeners'),
                distinctSpy = spy(miniDroneController.droneService.cmdObservable, 'distinctUntilChanged');

            miniDroneController.addListeners()
            assert.called(listenerSpy);
            assert.called(distinctSpy);
            done();

            miniDroneController.addListeners.restore();
            miniDroneController.droneService.cmdObservable.distinctUntilChanged.restore();
        });

        it("test if method fails", (done) => {
            let listenerSpy = spy(miniDroneController, 'addListeners'),
                distinctStub = stub(miniDroneController.droneService.cmdObservable, 'distinctUntilChanged')
                    .callsFake(() => {
                        throw new Error('failed');
                    });

            try  {
                miniDroneController.addListeners();
            } catch (e) {
                assert.called(listenerSpy);
                assert.called(distinctStub);
                expect(e).to.exist;
                done();
            }

            miniDroneController.addListeners.restore();
            miniDroneController.droneService.cmdObservable.distinctUntilChanged.restore();
        });
    });

    describe("test method: parseData", () => {
        it("test if exists", () => {
            expect(miniDroneController.parseData).to.exist;
        });

        it("test if method is called with minidrone command", (done) => {
            let methodSpy = spy(miniDroneController, 'parseData'),
                data = [2, 1, 2, 3, 1, 0, 0];

            let navInfo = miniDroneController.parseData(data);
            assert.called(methodSpy);
            expect(navInfo).to.exist;
            expect(navInfo.name).to.be.equal('flyingStateChanged');
            expect(navInfo.args).to.exist;
            expect(navInfo.args.length).to.equal(1);
            expect(navInfo.args[0].name).to.equal('state');
            expect(navInfo.args[0].value).to.equal('landed');
            done();

            miniDroneController.parseData.restore();
        });

        it("test if method is called with common command", (done) => {
            let methodSpy = spy(miniDroneController, 'parseData'),
                data = [4, 1, 0, 5, 1, 0, 95];

            let navInfo = miniDroneController.parseData(data);
            assert.called(methodSpy);
            expect(navInfo).to.exist;
            expect(navInfo.name).to.be.equal('batteryStateChanged');
            expect(navInfo.args).to.exist;
            expect(navInfo.args.length).to.equal(1);
            expect(navInfo.args[0].name).to.equal('percent');
            expect(navInfo.args[0].value).to.equal(95);
            done();

            miniDroneController.parseData.restore();
        });

        it("test if method is called with no data", (done) => {
            let methodSpy = spy(miniDroneController, 'parseData'),
                data = null;

            let navInfo = miniDroneController.parseData(data);
            assert.called(methodSpy);
            expect(navInfo).to.not.exist;
            done();

            miniDroneController.parseData.restore();
        });

        it("test if method is called with data.length equal to 0", (done) => {
            let methodSpy = spy(miniDroneController, 'parseData'),
                data = [];

            let navInfo = miniDroneController.parseData(data);
            assert.called(methodSpy);
            expect(navInfo).to.not.exist;
            done();

            miniDroneController.parseData.restore();
        });
    });

    describe("test method: getValuesByType", () => {
        it("test if exists", () => {
            expect(miniDroneController.getValuesByType).to.exist;
        });

        it("test if method is called with u8 value", (done) => {
            let methodSpy = spy(miniDroneController, 'getValuesByType'),
                buffer = Buffer.from([95]),
                arg = {
                    name: 'percent',
                    type: 'u8'
                };

            let args = miniDroneController.getValuesByType(buffer, 0, arg);
            assert.called(methodSpy);
            expect(args).to.exist;
            expect(args.length).to.equal(1);
            expect(args[0].name).to.equal('percent');
            expect(args[0].value).to.equal(95);
            done();

            miniDroneController.getValuesByType.restore();
        });

        it("test if method is called with u16 value", (done) => {
            let methodSpy = spy(miniDroneController, 'getValuesByType'),
                buffer = Buffer.alloc(2),
                arg = {
                    name: 'percent',
                    type: 'u16'
                };

            buffer.writeUInt16LE(95, 0);

            let args = miniDroneController.getValuesByType(buffer, 0, arg);
            assert.called(methodSpy);
            expect(args).to.exist;
            expect(args.length).to.equal(1);
            expect(args[0].name).to.equal('percent');
            expect(args[0].value).to.equal(95);
            done();

            miniDroneController.getValuesByType.restore();
        });

        it("test if method is called with u32 value", (done) => {
            let methodSpy = spy(miniDroneController, 'getValuesByType'),
                buffer = Buffer.alloc(4),
                arg = {
                    name: 'percent',
                    type: 'u32'
                };

            buffer.writeUInt32LE(95, 0);

            let args = miniDroneController.getValuesByType(buffer, 0, arg);
            assert.called(methodSpy);
            expect(args).to.exist;
            expect(args.length).to.equal(1);
            expect(args[0].name).to.equal('percent');
            expect(args[0].value).to.equal(95);
            done();

            miniDroneController.getValuesByType.restore();
        });

        it("test if method is called with i8 value", (done) => {
            let methodSpy = spy(miniDroneController, 'getValuesByType'),
                buffer = Buffer.alloc(1),
                arg = {
                    name: 'percent',
                    type: 'i8'
                };

            buffer.writeInt8(95, 0);

            let args = miniDroneController.getValuesByType(buffer, 0, arg);
            assert.called(methodSpy);
            expect(args).to.exist;
            expect(args.length).to.equal(1);
            expect(args[0].name).to.equal('percent');
            expect(args[0].value).to.equal(95);
            done();

            miniDroneController.getValuesByType.restore();
        });

        it("test if method is called with i16 value", (done) => {
            let methodSpy = spy(miniDroneController, 'getValuesByType'),
                buffer = Buffer.alloc(2),
                arg = {
                    name: 'percent',
                    type: 'i16'
                };

            buffer.writeInt16LE(95, 0);

            let args = miniDroneController.getValuesByType(buffer, 0, arg);
            assert.called(methodSpy);
            expect(args).to.exist;
            expect(args.length).to.equal(1);
            expect(args[0].name).to.equal('percent');
            expect(args[0].value).to.equal(95);
            done();

            miniDroneController.getValuesByType.restore();
        });

        it("test if method is called with i32 value", (done) => {
            let methodSpy = spy(miniDroneController, 'getValuesByType'),
                buffer = Buffer.alloc(4),
                arg = {
                    name: 'percent',
                    type: 'i32'
                };

            buffer.writeInt16LE(95, 0);

            let args = miniDroneController.getValuesByType(buffer, 0, arg);
            assert.called(methodSpy);
            expect(args).to.exist;
            expect(args.length).to.equal(1);
            expect(args[0].name).to.equal('percent');
            expect(args[0].value).to.equal(95);
            done();

            miniDroneController.getValuesByType.restore();
        });

        it("test if method is called with float value", (done) => {
            let methodSpy = spy(miniDroneController, 'getValuesByType'),
                buffer = Buffer.alloc(4),
                arg = {
                    name: 'percent',
                    type: 'float'
                };

            buffer.writeFloatLE(95, 0);

            let args = miniDroneController.getValuesByType(buffer, 0, arg);
            assert.called(methodSpy);
            expect(args).to.exist;
            expect(args.length).to.equal(1);
            expect(args[0].name).to.equal('percent');
            expect(args[0].value).to.equal(95);
            done();

            miniDroneController.getValuesByType.restore();
        });

        it("test if method is called with enum value", (done) => {
            let methodSpy = spy(miniDroneController, 'getValuesByType'),
                buffer = Buffer.alloc(1),
                arg = {
                    name: 'sensorName',
                    type: 'enum',
                    values: [
                        {
                            "name": "IMU",
                            "value": 1
                        },
                        {
                            "name": "barometer",
                            "value": 2
                        },
                        {
                            "name": "ultrasound",
                            "value": 3
                        }
                    ]
                };

            buffer.writeUInt8(3, 0);

            let args = miniDroneController.getValuesByType(buffer, 0, arg);
            assert.called(methodSpy);
            expect(args).to.exist;
            expect(args.length).to.equal(1);
            expect(args[0].name).to.equal('sensorName');
            expect(args[0].value).to.equal('ultrasound');
            done();

            miniDroneController.getValuesByType.restore();
        });

        it("test if method is called with string value", (done) => {
            let methodSpy = spy(miniDroneController, 'getValuesByType'),
                str = 'internal',
                buffer = Buffer.alloc(str.length),
                arg = {
                    name: 'mass_storage_name',
                    type: 'string'
                };

            buffer.write(str, 0, str.length, 'utf8');

            let args = miniDroneController.getValuesByType(buffer, 0, arg);
            assert.called(methodSpy);
            expect(args).to.exist;
            expect(args.length).to.equal(1);
            expect(args[0].name).to.equal('mass_storage_name');
            expect(args[0].value).to.equal('internal');
            done();

            miniDroneController.getValuesByType.restore();
        });

        it("test if method is called with no args", (done) => {
            let methodSpy = spy(miniDroneController, 'getValuesByType'),
                buffer = Buffer.from([]),
                arg = null;

            let args = miniDroneController.getValuesByType(buffer, 0, arg);
            assert.called(methodSpy);
            expect(args).to.exist;
            expect(args.length).to.equal(0);
            done();

            miniDroneController.getValuesByType.restore();
        });
    });

    describe("test method: genCommonCmds", () => {
        it("test if exists", () => {
            expect(miniDroneController.genCommonCmds).to.exist;
        });

        it("test if method is called", (done) => {
            let cmdSpy = spy(miniDroneController, 'genCommonCmds');

            let buffer = miniDroneController.genCommonCmds('allStates');
            assert.called(cmdSpy);
            expect(buffer).to.exist;
            done();

            miniDroneController.genCommonCmds.restore();
        });

        it("test all states command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genCommonCmds');

            let buffer = miniDroneController.genCommonCmds('allStates');
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+3+0+4+0+0');
            done();

            miniDroneController.genCommonCmds.restore();
        });
    });

    describe("test method: genMiniDroneCmds", () => {
        it("test if exists", () => {
            expect(miniDroneController.genMiniDroneCmds).to.exist;
        });

        it("test if method is called", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds');

            let buffer = miniDroneController.genMiniDroneCmds('piloting', 'takeOff');
            assert.called(cmdSpy);
            expect(buffer).to.exist;
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test flatTrim command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds');

            let buffer = miniDroneController.genMiniDroneCmds('piloting', 'flatTrim');
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+5+2+0+0+0');
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test takeOff command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds');

            let buffer = miniDroneController.genMiniDroneCmds('piloting', 'takeOff');
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+6+2+0+1+0');
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test landing command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds');

            let buffer = miniDroneController.genMiniDroneCmds('piloting', 'landing');
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+7+2+0+3+0');
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test emergency command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds');

            let buffer = miniDroneController.genMiniDroneCmds('piloting', 'emergency');
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+8+2+0+4+0');
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test maneuver - roll command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds'),
                args = [0, 10, 0, 0, 0, 1000];

            let buffer = miniDroneController.genMiniDroneCmds('piloting', 'maneuver', args, args.length + 3);
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+9+2+0+2+0+0+10+0+0+0+232+3+0+0');
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test maneuver - pitch command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds'),
                args = [0, 0, 10, 0, 0, 1000];

            let buffer = miniDroneController.genMiniDroneCmds('piloting', 'maneuver', args, args.length + 3);
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+10+2+0+2+0+0+0+10+0+0+232+3+0+0');
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test maneuver - yaw command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds'),
                args = [0, 0, 0, -10, 0, 1000];

            let buffer = miniDroneController.genMiniDroneCmds('piloting', 'maneuver', args, args.length + 3);
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+11+2+0+2+0+0+0+0+246+0+232+3+0+0');
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test maneuver - gaz command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds'),
                args = [0, 0, 0, 0, -100, 1000];

            let buffer = miniDroneController.genMiniDroneCmds('piloting', 'maneuver', args, args.length + 3);
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+12+2+0+2+0+0+0+0+0+156+232+3+0+0');
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test animations - flip front command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds'),
                args = [0];

            let buffer = miniDroneController.genMiniDroneCmds('animations', 'flip', args, args.length);
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+13+2+4+0+0+'+ args.join());
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test animations - flip back command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds'),
                args = [1];

            let buffer = miniDroneController.genMiniDroneCmds('animations', 'flip', args, args.length);
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+14+2+4+0+0+'+ args.join());
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test animations - flip right command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds'),
                args = [2];

            let buffer = miniDroneController.genMiniDroneCmds('animations', 'flip', args, args.length);
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+15+2+4+0+0+'+ args.join());
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test animations - flip left command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds'),
                args = [3];

            let buffer = miniDroneController.genMiniDroneCmds('animations', 'flip', args, args.length);
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+16+2+4+0+0+'+ args.join());
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test take picture command", (done) => {
            let cmdSpy = spy(miniDroneController, 'genMiniDroneCmds'),
                args = [0];

            let buffer = miniDroneController.genMiniDroneCmds('mediaRecord', 'picture', args, args.length);
            let str = Array.prototype.slice.call(buffer, 0).join('+');

            assert.called(cmdSpy);
            expect(buffer).to.exist;
            expect(str).to.exist;
            expect(str).to.be.equal('2+17+2+6+0+0+'+ args.join());
            done();

            miniDroneController.genMiniDroneCmds.restore();
        });
    });

    describe("test method: sendPilotingCommand", () => {
        it("test if exists", () => {
            expect(miniDroneController.sendPilotingCommand).to.exist;
        });

        it("test if method is called", (done) => {
            let sendCmdSpy = spy(miniDroneController, 'sendPilotingCommand'),
                genCmdSpy = spy(miniDroneController, 'genMiniDroneCmds');

            miniDroneController.sendPilotingCommand('piloting', 'takeOff').then(value => {
                assert.called(sendCmdSpy);
                assert.called(genCmdSpy);
                assert.called(sendDroneCmdServiceStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneController.sendPilotingCommand.restore();
            miniDroneController.genMiniDroneCmds.restore();
        });

        it("test if method fails", (done) => {
            let sendCmdSpy = spy(miniDroneController, 'sendPilotingCommand'),
                genCmdSpy = stub(miniDroneController, 'genMiniDroneCmds').callsFake(() => {
                    throw new Error('failed');
                });

            miniDroneController.sendPilotingCommand('piloting', 'takeOff').then(value => {
                done();
            }).catch(e => {
                assert.called(sendCmdSpy);
                assert.called(genCmdSpy);
                assert.called(sendDroneCmdServiceStub);
                expect(e).to.exist;
                done();
            });

            miniDroneController.sendPilotingCommand.restore();
            miniDroneController.genMiniDroneCmds.restore();
        });
    });

    // describe("test navdata stream", () => {
    //     it("test data", (done) => {
    //
    //         miniDroneController.connect('RS_').then(value => {
    //             if (value === 'success') {
    //                 miniDroneController.checkAllStates().then(value => {
    //                     setTimeout(() => {
    //                         done();
    //                     }, 10000);
    //                 });
    //             }
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //     });
    // });

});

after(() => {
    miniDroneController.droneService.startScanning.restore();
    miniDroneController.droneService.stopScanning.restore();
    miniDroneController.droneService.discoverDevice.restore();
    miniDroneController.droneService.connect.restore();
    miniDroneController.droneService.updateProximity.restore();
    miniDroneController.droneService.discoverServices.restore();
    miniDroneController.droneService.discoverCharacteristics.restore();
    miniDroneController.droneService.identifyCharacteristics.restore();
    miniDroneController.droneService.sendNavCommand.restore();
    miniDroneController.droneService.disconnect.restore();

    miniDroneController = null;
    fakePromise = null;
});