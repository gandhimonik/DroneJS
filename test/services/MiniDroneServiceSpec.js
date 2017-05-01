import { expect }               from 'chai';
import { assert, spy, stub }    from 'sinon';
import { EventEmitter }         from 'events';
import { Observable }           from 'rxjs';

import { MiniDroneService } from '../../src/services/MiniDroneService';

let miniDroneService = null,
    noble = null,
    peripheral,
    service,
    charList1,
    charList2,
    charList3;

before(() => {
    miniDroneService = new MiniDroneService();
    noble = miniDroneService.noble;
    peripheral = {
        on: function(str, fn) { fn(); },
        connect: function() { return true; },
        updateRssi: function () {
            return true;
        },
        discoverServices: function () {
            return true;
        },
        disconnect: function() {
            return true;
        }
    };
    service = {
        on: function(str, fn) { fn(); },
        discoverCharacteristics: function () {
            return true;
        }
    };

    charList1 = [
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fa", on: function(str, fn) { fn(); }, write: function() { return true; } }
    ];

    charList2 = [
        { uuid: "fb", on: function(str, fn) { fn(); } }
    ];

    charList3 = [
        { uuid: "fd21", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fd21", on: function(str, fn) { fn(); }, write: function() { return true; } },
        { uuid: "fd21", on: function(str, fn) { fn(); }, write: function() { return true; } }
    ];

    miniDroneService.drone = peripheral;
});

describe("MiniDroneService", () => {

    it("test if exists", () => {
        expect(miniDroneService).to.exist;
    });

    it("test if all the properties are initialized", () => {
        expect(miniDroneService.drone).to.be.not.null;
        expect(miniDroneService.cmdService).to.be.null;
        expect(miniDroneService.ftpGetService).to.be.null;
        expect(miniDroneService.ftpHandlingService).to.be.null;
        expect(miniDroneService.cmdObservable).to.be.null;
        expect(miniDroneService.ftpObservable).to.be.null;
    });

    describe("test method: startScanning", () => {
        it("test if exists", () => {
            expect(miniDroneService.startScanning).to.exist;
        });

        it("test if method is called", (done) => {
            let startScanningSpy = spy(miniDroneService, "startScanning");
            stub(noble, "startScanning").callsFake(() => noble.emit("scanStart"));

            miniDroneService.startScanning().then((value) => {
                assert.calledOnce(startScanningSpy);
                expect(value).to.equal("success");
                miniDroneService.startScanning.restore();
                noble.startScanning.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });
    });

    describe("test method: stopScanning", () => {
        it("test if exists", () => {
            expect(miniDroneService.stopScanning).to.exist;
        });

        it("test if method is called", (done) => {
            let stopScanningSpy = spy(miniDroneService, "stopScanning");
            stub(noble, "stopScanning").callsFake(() => noble.emit("scanStop"));

            miniDroneService.stopScanning().then((value) => {
                assert.calledOnce(stopScanningSpy);
                expect(value).to.equal("success");
                miniDroneService.stopScanning.restore();
                noble.stopScanning.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });
    });

    describe("test method: discoverDevice", () => {
        it("test if exists", () => {
            expect(miniDroneService.discoverDevice).to.exist;
        });

        it("test if method is called", (done) => {
            let discoverDeviceSpy = spy(miniDroneService, "discoverDevice");

            miniDroneService.discoverDevice("RS_Sample").then((value) => {
                assert.calledOnce(discoverDeviceSpy);
                expect(value).to.exist;
                expect(value.advertisement).to.exist;
                expect(value.advertisement.localName).to.exist;
                expect(value.advertisement.localName).to.equal("RS_Sample");
                miniDroneService.discoverDevice.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });

            noble.emit("discover", {
                advertisement: {
                    localName: 'RS_Sample'
                },
                rssi: 40
            });
        });

        it("test if method fails", (done) => {
            let discoverDeviceSpy = spy(miniDroneService, "discoverDevice");
            stub(noble, 'on').callsFake(() => {
                throw new Error("failed");
            });

            miniDroneService.discoverDevice("RS_Sample").then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(discoverDeviceSpy);
                expect(e).to.exist;
                miniDroneService.discoverDevice.restore();
                noble.on.restore();
                done();
            });
        });
    });

    describe("test method: connect", () => {
        it("test if exists", () => {
            expect(miniDroneService.connect).to.exist;
        });

        it("test if method is called", (done) => {
            let connectSpy = spy(miniDroneService, "connect"),
                peripheralOnSpy = spy(peripheral, "on"),
                peripheralConnectSpy = spy(peripheral, "connect");

            miniDroneService.connect(peripheral).then((value) => {
                assert.calledOnce(connectSpy);
                assert.calledOnce(peripheralOnSpy);
                assert.calledOnce(peripheralConnectSpy);
                expect(value).to.exist;
                expect(value).to.equal("success");
                miniDroneService.connect.restore();
                peripheral.on.restore();
                peripheral.connect.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });

        it("test if peripheral.on method fails", (done) => {
            let connectSpy = spy(miniDroneService, "connect"),
                onStub = stub(peripheral, "on").callsFake(() => {
                    throw new Error("failed");
                }),
                peripheralConnectSpy = spy(peripheral, "connect");

            miniDroneService.connect(peripheral).then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(connectSpy);
                assert.calledOnce(onStub);
                assert.notCalled(peripheralConnectSpy);
                expect(e).to.exist;
                miniDroneService.connect.restore();
                peripheral.on.restore();
                peripheral.connect.restore();
                done();
            });
        });

        it("test if peripheral.connect method fails", (done) => {
            let connectSpy = spy(miniDroneService, "connect"),
                connectStub = stub(peripheral, "connect").callsFake(() => {
                    throw new Error("failed");
                }),
                peripheralOnSpy = spy(peripheral, "on");

            miniDroneService.connect(peripheral).then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(connectSpy);
                assert.calledOnce(connectStub);
                assert.notCalled(peripheralOnSpy);
                expect(e).to.exist;
                done();
            });

            miniDroneService.connect.restore();
            peripheral.connect.restore();
            peripheral.on.restore();
        });
    });

    describe("test method: updateProximity", () => {
        it("test if exists", () => {
            expect(miniDroneService.updateProximity).to.exist;
        });

        it("test if method is called", (done) => {
            let proximitySpy = spy(miniDroneService, "updateProximity"),
                onSpy = spy(peripheral, "on"),
                rssiSpy = spy(peripheral, "updateRssi");

            miniDroneService.updateProximity().then((value) => {
                assert.calledOnce(proximitySpy);
                assert.calledOnce(onSpy);
                assert.calledOnce(rssiSpy);
                expect(value).to.exist;
                expect(value).to.equal("success");
                miniDroneService.updateProximity.restore();
                peripheral.on.restore();
                peripheral.updateRssi.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });

        it("test if drone.updateRssi method fails", (done) => {
            let proximitySpy = spy(miniDroneService, "updateProximity"),
                onSpy = spy(peripheral, "on"),
                rssiStub = stub(peripheral, "updateRssi").callsFake(() => {
                    throw new Error("failed");
                });

            miniDroneService.updateProximity().then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(proximitySpy);
                assert.calledOnce(onSpy);
                assert.calledOnce(rssiStub);
                expect(e).to.exist;
                done();
            });

            miniDroneService.updateProximity.restore();
            peripheral.on.restore();
            peripheral.updateRssi.restore();
        });

        it("test if drone.on method fails", (done) => {
            let proximitySpy = spy(miniDroneService, "updateProximity"),
                onStub = stub(peripheral, "on").callsFake(() => {
                    throw new Error("failed");
                }),
                rssiSpy = spy(peripheral, "updateRssi");

            miniDroneService.updateProximity().then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(proximitySpy);
                assert.calledOnce(onStub);
                assert.notCalled(rssiSpy);
                expect(e).to.exist;
                done();
            });

            miniDroneService.updateProximity.restore();
            peripheral.on.restore();
            peripheral.updateRssi.restore();
        });
    });

    describe("test method: discoverServices", () => {
        it("test if exists", () => {
            expect(miniDroneService.discoverServices).to.exist;
        });

        it("test if method is called", (done) => {
            let servicesSpy = spy(miniDroneService, "discoverServices"),
                onSpy = spy(peripheral, "on"),
                discoverServicesSpy = spy(peripheral, "discoverServices");

            miniDroneService.discoverServices().then((value) => {
                assert.calledOnce(servicesSpy);
                assert.calledOnce(onSpy);
                assert.calledOnce(discoverServicesSpy);
                miniDroneService.discoverServices.restore();
                peripheral.on.restore();
                peripheral.discoverServices.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });

        it("test if drone.discoverServices method fails", (done) => {
            let servicesSpy = spy(miniDroneService, "discoverServices"),
                onSpy = spy(peripheral, "on"),
                discoverServicesStub = stub(peripheral, "discoverServices").callsFake(() => {
                    throw new Error("failed");
                });

            miniDroneService.discoverServices().then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(servicesSpy);
                assert.calledOnce(onSpy);
                assert.calledOnce(discoverServicesStub);
                expect(e).to.exist;
                done();
            });

            miniDroneService.discoverServices.restore();
            peripheral.on.restore();
            peripheral.discoverServices.restore();
        });

        it("test if drone.on method fails", (done) => {
            let servicesSpy = spy(miniDroneService, "discoverServices"),
                onStub = stub(peripheral, "on").callsFake(() => {
                    throw new Error("failed");
                }),
                discoverServicesSpy = spy(peripheral, "discoverServices");

            miniDroneService.discoverServices().then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(servicesSpy);
                assert.calledOnce(onStub);
                assert.notCalled(discoverServicesSpy);
                expect(e).to.exist;
                done();
            });

            miniDroneService.discoverServices.restore();
            peripheral.on.restore();
            peripheral.discoverServices.restore();
        });
    });

    describe("test method: discoverCharacteristics", () => {
        it("test if exists", () => {
            expect(miniDroneService.discoverCharacteristics).to.exist;
        });

        it("test if method is called", (done) => {
            let serviceSpy = spy(miniDroneService, "discoverCharacteristics"),
                identifyStub = stub(miniDroneService, "identifyCharacteristics").callsFake(() => true),
                onSpy = spy(service, "on"),
                discoverCharSpy = spy(service, "discoverCharacteristics");

            miniDroneService.discoverCharacteristics(service).then((value) => {
                assert.calledOnce(serviceSpy);
                assert.calledOnce(identifyStub);
                assert.calledOnce(onSpy);
                assert.calledOnce(discoverCharSpy);
                miniDroneService.discoverCharacteristics.restore();
                miniDroneService.identifyCharacteristics.restore();
                service.on.restore();
                service.discoverCharacteristics.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });

        it("test if service.discoverCharacteristics method fails", (done) => {
            let serviceSpy = spy(miniDroneService, "discoverCharacteristics"),
                identifyStub = stub(miniDroneService, "identifyCharacteristics").callsFake(() => true),
                onSpy = spy(service, "on"),
                discoverCharStub = stub(service, "discoverCharacteristics").callsFake(() => {
                    throw new Error("failed");
                });

            miniDroneService.discoverCharacteristics(service).then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(serviceSpy);
                assert.notCalled(identifyStub);
                assert.calledOnce(onSpy);
                assert.calledOnce(discoverCharStub);
                expect(e).to.exist;
                done();
            });

            miniDroneService.discoverCharacteristics.restore();
            miniDroneService.identifyCharacteristics.restore();
            service.on.restore();
            service.discoverCharacteristics.restore();
        });

        it("test if service.on method fails", (done) => {
            let serviceSpy = spy(miniDroneService, "discoverCharacteristics"),
                identifyStub = stub(miniDroneService, "identifyCharacteristics").callsFake(() => true),
                onSpy = stub(service, "on").callsFake(() => {
                    throw new Error("failed");
                }),
                discoverCharSpy = spy(service, "discoverCharacteristics");

            miniDroneService.discoverCharacteristics(service).then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(serviceSpy);
                assert.notCalled(identifyStub);
                assert.calledOnce(onSpy);
                assert.notCalled(discoverCharSpy);
                expect(e).to.exist;
                done();
            });

            miniDroneService.discoverCharacteristics.restore();
            miniDroneService.identifyCharacteristics.restore();
            service.on.restore();
            service.discoverCharacteristics.restore();
        });
    });

    describe("test method: identifyCharacteristics", () => {
        it("test if exists", () => {
            expect(miniDroneService.identifyCharacteristics).to.exist;
        });

        it("test if method initializes cmdService", () => {
            let serviceSpy = spy(miniDroneService, "identifyCharacteristics");

            miniDroneService.identifyCharacteristics(charList1);

            assert.calledOnce(serviceSpy);
            expect(miniDroneService.cmdService).to.exist;
            miniDroneService.identifyCharacteristics.restore();
        });

        it("test if method initializes cmdObservable", () => {
            let serviceSpy = spy(miniDroneService, "identifyCharacteristics");

            miniDroneService.identifyCharacteristics(charList2);

            assert.calledOnce(serviceSpy);
            expect(miniDroneService.cmdObservable).to.exist;
            miniDroneService.identifyCharacteristics.restore();
        });

        it("test if method initializes ftpGetService, ftpHandlingService, ftpObservable", () => {
            let serviceSpy = spy(miniDroneService, "identifyCharacteristics");

            miniDroneService.identifyCharacteristics(charList3);

            assert.calledOnce(serviceSpy);
            expect(miniDroneService.ftpGetService).to.exist;
            expect(miniDroneService.ftpHandlingService).to.exist;
            expect(miniDroneService.ftpObservable).to.exist;
            miniDroneService.identifyCharacteristics.restore();
        });
    });

    describe("test method: createObservable", () => {
        it("test if exists", () => {
            expect(miniDroneService.createObservable).to.exist;
        });

        it("test if method is called", () => {
            let serviceSpy = spy(miniDroneService, "createObservable"),
                obsSpy  = spy(Observable, "create");

            let observable = miniDroneService.createObservable(charList2);
            assert.calledOnce(serviceSpy);
            assert.calledOnce(obsSpy);
            expect(observable).to.exist;
            expect(observable.subscribe).to.exist;

            miniDroneService.createObservable.restore();
            Observable.create.restore();
        });

        it("test if method initializes observable object", () => {
            let serviceSpy = spy(miniDroneService, "createObservable"),
                obsSpy  = spy(Observable, "create");

            let observable = miniDroneService.createObservable(charList2);
            let subscription = observable.subscribe(data => {

            },
            err => console.log(err),
            () => console.log('complete'));

            assert.calledOnce(serviceSpy);
            assert.calledOnce(obsSpy);
            expect(observable).to.exist;
            expect(observable.subscribe).to.exist;
            expect(subscription).to.exist;
            expect(subscription.unsubscribe).to.exist;

            miniDroneService.createObservable.restore();
            Observable.create.restore();
        });
    });

    describe("test method: sendDroneCommand", () => {
        it("test if exists", () => {
            expect(miniDroneService.sendDroneCommand).to.exist;
        });

        it("test if method is called", (done) => {
            let serviceSpy = spy(miniDroneService, "sendDroneCommand");

            miniDroneService.identifyCharacteristics(charList1);

            miniDroneService.sendDroneCommand().then((value) => {
                assert.calledOnce(serviceSpy);
                expect(value).to.exist;
                expect(value).to.equal("success");
                miniDroneService.sendDroneCommand.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });

        it("test if method fails", (done) => {
            let serviceSpy = spy(miniDroneService, "sendDroneCommand"),
                serviceStub = stub(charList1[10], "write").callsFake(() => {
                    throw new Error("failed");
                });

            miniDroneService.identifyCharacteristics(charList1);

            miniDroneService.sendDroneCommand().then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(serviceSpy);
                assert.calledOnce(serviceStub);
                expect(e).to.exist;
                miniDroneService.sendDroneCommand.restore();
                charList1[10].write.restore();
                done();
            });
        });
    });

    describe("test method: sendFTPCommand", () => {
        it("test if exists", () => {
            expect(miniDroneService.sendFTPCommand).to.exist;
        });

        it("test if method is called", (done) => {
            let serviceSpy = spy(miniDroneService, "sendFTPCommand");

            miniDroneService.identifyCharacteristics(charList3);

            miniDroneService.sendFTPCommand().then((value) => {
                assert.calledOnce(serviceSpy);
                expect(miniDroneService.ftpHandlingService).to.exist;
                expect(miniDroneService.ftpGetService).to.exist;
                expect(value).to.exist;
                expect(value).to.equal("success");
                miniDroneService.sendFTPCommand.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });

        it("test if ftpGetService.write method gets called", (done) => {
            let serviceSpy = spy(miniDroneService, "sendFTPCommand"),
                writeSpy = spy(charList3[1], "write");

            miniDroneService.identifyCharacteristics(charList3);

            miniDroneService.sendFTPCommand(null, true).then((value) => {
                assert.calledOnce(serviceSpy);
                assert.calledOnce(writeSpy);
                expect(value).to.exist;
                expect(value).to.equal("success");
                miniDroneService.sendFTPCommand.restore();
                charList3[1].write.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });

        it("test if ftpHandlingService.write method gets called", (done) => {
            let serviceSpy = spy(miniDroneService, "sendFTPCommand"),
                writeSpy = spy(charList3[2], "write");

            miniDroneService.identifyCharacteristics(charList3);

            miniDroneService.sendFTPCommand(null, false).then((value) => {
                assert.calledOnce(serviceSpy);
                assert.calledOnce(writeSpy);
                expect(value).to.exist;
                expect(value).to.equal("success");
                miniDroneService.sendFTPCommand.restore();
                charList3[2].write.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });

        it("test if ftpGetService.write method fails", (done) => {
            let serviceSpy = spy(miniDroneService, "sendFTPCommand"),
                writeStub = stub(charList3[1], "write").callsFake(() => {
                    throw new Error("failed");
                });

            miniDroneService.identifyCharacteristics(charList3);

            miniDroneService.sendFTPCommand(null, true).then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(serviceSpy);
                assert.calledOnce(writeStub);
                expect(e).to.exist;
                miniDroneService.sendFTPCommand.restore();
                charList3[1].write.restore();
                done();
            });
        });

        it("test if ftpHandlingService.write method fails", (done) => {
            let serviceSpy = spy(miniDroneService, "sendFTPCommand"),
                writeStub = stub(charList3[2], "write").callsFake(() => {
                    throw new Error("failed");
                });

            miniDroneService.identifyCharacteristics(charList3);

            miniDroneService.sendFTPCommand(null, false).then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(serviceSpy);
                assert.calledOnce(writeStub);
                expect(e).to.exist;
                miniDroneService.sendFTPCommand.restore();
                charList3[2].write.restore();
                done();
            });
        });
    });

    describe("test method: disconnect", () => {
        it("test if exists", () => {
            expect(miniDroneService.disconnect).to.exist;
        });

        it("test if method is called", (done) => {
            let serviceSpy = spy(miniDroneService, "disconnect");

            miniDroneService.disconnect().then((value) => {
                assert.calledOnce(serviceSpy);
                expect(value).to.exist;
                expect(value).to.equal("success");
                miniDroneService.disconnect.restore();
                done();
            }).catch((e) => {
                assert.fail(e);
                done();
            });
        });

        it("test if method fails", (done) => {
            let serviceSpy = spy(miniDroneService, "disconnect"),
                disConnectStub = stub(peripheral, "disconnect").callsFake(() => {
                    throw new Error("failed");
                });

            miniDroneService.disconnect().then((value) => {
                done();
            }).catch((e) => {
                assert.calledOnce(serviceSpy);
                assert.calledOnce(disConnectStub);
                expect(e).to.exist;
                done();
            });

            miniDroneService.disconnect.restore();
            peripheral.disconnect.restore();
        });
    });
});

after(() => {
    miniDroneService = null;
    peripheral = null;
});