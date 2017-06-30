import { expect }               from 'chai';
import { assert, spy, stub }    from 'sinon';

import { MiniDroneView }        from '../../src/views/MiniDroneView';
import { Observable }           from 'rxjs/Observable';
import { debug }                from '../../src/utils/debug';

let miniDroneView = null,
    fakePromise,
    sendCmdStub,
    sendMediaCmdStub,
    connectStub,
    checkStateStub,
    disconnectStub,
    execStub;

before(() => {
    miniDroneView = new MiniDroneView();
    fakePromise = {
        then: function(fn) {
            fn();
            return {
                catch: function() {}
            }
        }
    };

    sendCmdStub = stub(miniDroneView.droneController, 'sendPilotingCommand').callsFake(() => fakePromise);
    sendMediaCmdStub = stub(miniDroneView.droneController, 'sendMediaCommand').callsFake(() => fakePromise);
    connectStub = stub(miniDroneView.droneController, 'connect').callsFake(() => fakePromise);
    checkStateStub = stub(miniDroneView.droneController, 'checkAllStates').callsFake(() => fakePromise);
    disconnectStub = stub(miniDroneView.droneController, 'disconnect').callsFake(() => fakePromise);
    execStub = stub(miniDroneView, '_execManeuver').callsFake(() => fakePromise);
});

describe("MiniDroneView", () => {

    it("test if exists", () => {
        expect(miniDroneView).to.exist;
    });

    it("test if all the properties are initialized", () => {
        expect(miniDroneView.droneController).to.exist;
    });

    describe("test method: logging", () => {
        it("test if exists", () => {
            expect(miniDroneView.logging).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'logging');

            miniDroneView.logging(true).then(response => {
                assert.called(methodSpy);
                expect(response).to.exist;
                expect(response).to.be.equal('success');
                done();
            });


            miniDroneView.logging.restore();
        });
    });

    describe("test method: connect", () => {
        it("test if exists", () => {
            expect(miniDroneView.connect).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'connect');

            miniDroneView.connect('RS_').then(value => {
                assert.called(methodSpy);
                assert.called(connectStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.connect.restore();
        });
    });

    describe("test method: checkAllStates", () => {
        it("test if exists", () => {
            expect(miniDroneView.checkAllStates).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'checkAllStates');

            miniDroneView.checkAllStates().then(value => {
                assert.called(methodSpy);
                assert.called(checkStateStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.checkAllStates.restore();
        });
    });

    describe("test method: flatTrim", () => {
        it("test if exists", () => {
            expect(miniDroneView.flatTrim).to.exist;
        });

        it("test if method is called", (done) => {
            let flatTrimSpy = spy(miniDroneView, 'flatTrim');

            miniDroneView.flatTrim().then(value => {
                assert.called(flatTrimSpy);
                assert.called(sendCmdStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.flatTrim.restore();
        });
    });

    describe("test method: takeOff", () => {
        it("test if exists", () => {
            expect(miniDroneView.takeOff).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'takeOff');

            miniDroneView.takeOff().then(value => {
                assert.called(methodSpy);
                assert.called(sendCmdStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.droneController.emit('flyingStateChanged', {
                state: 'hovering'
            });
            miniDroneView.takeOff.restore();
        });
    });

    describe("test method: turnLeft", () => {
        it("test if exists", () => {
            expect(miniDroneView.turnLeft).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'turnLeft');

            miniDroneView.turnLeft(50, 500).then(value => {
                assert.called(methodSpy);
                assert.called(execStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.turnLeft.restore();
        });

        it("test if method is called with wrong intensity", (done) => {
            let methodSpy = spy(miniDroneView, 'turnLeft');

            miniDroneView.turnLeft(-10, 500).then(value => {
                done();
            }).catch(e => {
                assert.called(methodSpy);
                expect(e).to.exist;
                expect(e).to.be.equal('Error: Value for intensity should be between 0 and 100');
                done();
            });

            miniDroneView.turnLeft.restore();
        });
    });

    describe("test method: turnRight", () => {
        it("test if exists", () => {
            expect(miniDroneView.turnRight).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'turnRight');

            miniDroneView.turnRight(50, 500).then(value => {
                assert.called(methodSpy);
                assert.called(execStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.turnRight.restore();
        });

        it("test if method is called with wrong intensity", (done) => {
            let methodSpy = spy(miniDroneView, 'turnRight');

            miniDroneView.turnRight(-10, 500).then(value => {
                done();
            }).catch(e => {
                assert.called(methodSpy);
                expect(e).to.exist;
                expect(e).to.be.equal('Error: Value for intensity should be between 0 and 100');
                done();
            });

            miniDroneView.turnRight.restore();
        });
    });

    describe("test method: backward", () => {
        it("test if exists", () => {
            expect(miniDroneView.backward).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'backward');

            miniDroneView.backward(50, 500).then(value => {
                assert.called(methodSpy);
                assert.called(execStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.backward.restore();
        });

        it("test if method is called with wrong intensity", (done) => {
            let methodSpy = spy(miniDroneView, 'backward');

            miniDroneView.backward(-10, 500).then(value => {
                done();
            }).catch(e => {
                assert.called(methodSpy);
                expect(e).to.exist;
                expect(e).to.be.equal('Error: Value for intensity should be between 0 and 100');
                done();
            });

            miniDroneView.backward.restore();
        });
    });

    describe("test method: forward", () => {
        it("test if exists", () => {
            expect(miniDroneView.forward).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'forward');

            miniDroneView.forward(50, 500).then(value => {
                assert.called(methodSpy);
                assert.called(execStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.forward.restore();
        });

        it("test if method is called with wrong intensity", (done) => {
            let methodSpy = spy(miniDroneView, 'forward');

            miniDroneView.forward(-10, 500).then(value => {
                done();
            }).catch(e => {
                assert.called(methodSpy);
                expect(e).to.exist;
                expect(e).to.be.equal('Error: Value for intensity should be between 0 and 100');
                done();
            });

            miniDroneView.forward.restore();
        });
    });

    describe("test method: left", () => {
        it("test if exists", () => {
            expect(miniDroneView.left).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'left');

            miniDroneView.left(50, 500).then(value => {
                assert.called(methodSpy);
                assert.called(execStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.left.restore();
        });

        it("test if method is called with wrong intensity", (done) => {
            let methodSpy = spy(miniDroneView, 'left');

            miniDroneView.left(-10, 500).then(value => {
                done();
            }).catch(e => {
                assert.called(methodSpy);
                expect(e).to.exist;
                expect(e).to.be.equal('Error: Value for intensity should be between 0 and 100');
                done();
            });

            miniDroneView.left.restore();
        });
    });

    describe("test method: right", () => {
        it("test if exists", () => {
            expect(miniDroneView.right).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'right');

            miniDroneView.right(50, 500).then(value => {
                assert.called(methodSpy);
                assert.called(execStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.right.restore();
        });

        it("test if method is called with wrong intensity", (done) => {
            let methodSpy = spy(miniDroneView, 'right');

            miniDroneView.right(-10, 500).then(value => {
                done();
            }).catch(e => {
                assert.called(methodSpy);
                expect(e).to.exist;
                expect(e).to.be.equal('Error: Value for intensity should be between 0 and 100');
                done();
            });

            miniDroneView.right.restore();
        });
    });

    describe("test method: up", () => {
        it("test if exists", () => {
            expect(miniDroneView.up).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'up');

            miniDroneView.up(50, 500).then(value => {
                assert.called(methodSpy);
                assert.called(execStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.up.restore();
        });

        it("test if method is called with wrong intensity", (done) => {
            let methodSpy = spy(miniDroneView, 'up');

            miniDroneView.up(-10, 500).then(value => {
                done();
            }).catch(e => {
                assert.called(methodSpy);
                expect(e).to.exist;
                expect(e).to.be.equal('Error: Value for intensity should be between 0 and 100');
                done();
            });

            miniDroneView.up.restore();
        });
    });

    describe("test method: down", () => {
        it("test if exists", () => {
            expect(miniDroneView.down).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'down');

            miniDroneView.down(50, 500).then(value => {
                assert.called(methodSpy);
                assert.called(execStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.down.restore();
        });

        it("test if method is called with wrong intensity", (done) => {
            let methodSpy = spy(miniDroneView, 'down');

            miniDroneView.down(-10, 500).then(value => {
                done();
            }).catch(e => {
                assert.called(methodSpy);
                expect(e).to.exist;
                expect(e).to.be.equal('Error: Value for intensity should be between 0 and 100');
                done();
            });

            miniDroneView.down.restore();
        });
    });

    describe("test method: frontFlip", () => {
        it("test if exists", () => {
            expect(miniDroneView.frontFlip).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'frontFlip');

            miniDroneView.frontFlip().then(value => {
                assert.called(methodSpy);
                assert.called(sendCmdStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.frontFlip.restore();
        });
    });

    describe("test method: backFlip", () => {
        it("test if exists", () => {
            expect(miniDroneView.backFlip).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'backFlip');

            miniDroneView.backFlip().then(value => {
                assert.called(methodSpy);
                assert.called(sendCmdStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.backFlip.restore();
        });
    });

    describe("test method: leftFlip", () => {
        it("test if exists", () => {
            expect(miniDroneView.leftFlip).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'leftFlip');

            miniDroneView.leftFlip().then(value => {
                assert.called(methodSpy);
                assert.called(sendCmdStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.leftFlip.restore();
        });
    });

    describe("test method: rightFlip", () => {
        it("test if exists", () => {
            expect(miniDroneView.rightFlip).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'rightFlip');

            miniDroneView.rightFlip().then(value => {
                assert.called(methodSpy);
                assert.called(sendCmdStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.rightFlip.restore();
        });
    });

    describe("test method: takePicture", () => {
        it("test if exists", () => {
            expect(miniDroneView.takePicture).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'takePicture');

            miniDroneView.takePicture().then(value => {
                assert.called(methodSpy);
                assert.called(sendCmdStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.takePicture.restore();
        });
    });

    describe("test method: listAllPictures", () => {
        it("test if exists", () => {
            expect(miniDroneView.listAllPictures).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'listAllPictures'),
                onStub = spy(miniDroneView.droneController, 'on');

            miniDroneView.listAllPictures().then(value => {
                assert.called(methodSpy);
                assert.called(sendMediaCmdStub);
                assert.called(onStub);
                expect(value).to.exist;
                expect(value).to.be.an('array');
                expect(value).to.include('Rolling_Spider_IMG1.jpg');
                expect(value).to.include('Rolling_Spider_IMG2.jpg');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            let buffer = Buffer.from('Rolling_Spider_IMG1.jpg \n Rolling_Spider_IMG2.jpg \n end of transfer');
            miniDroneView.droneController.emit('media-data', {
                state: 'LIS',
                data: buffer
            });

            miniDroneView.listAllPictures.restore();
            miniDroneView.droneController.on.restore();
        });
    });

    describe("test method: downloadPicture", () => {
        it("test if exists", () => {
            expect(miniDroneView.downloadPicture).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'downloadPicture'),
                onStub = spy(miniDroneView.droneController, 'on');

            miniDroneView.downloadPicture('Rolling_Spider_IMG1.jpg', 'output').then(value => {
                assert.called(methodSpy);
                assert.called(sendMediaCmdStub);
                assert.called(onStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            let buffer = Buffer.from('Rolling_Spider_IMG1.jpg \n Rolling_Spider_IMG2.jpg \n end of transfer');
            miniDroneView.droneController.emit('media-data', {
                state: 'GET',
                data: buffer
            });

            miniDroneView.downloadPicture.restore();
            miniDroneView.droneController.on.restore();
        });

        it("test if method is called with sending multiple packets", (done) => {
            let methodSpy = spy(miniDroneView, 'downloadPicture'),
                onStub = spy(miniDroneView.droneController, 'on');

            miniDroneView.downloadPicture('Rolling_Spider_IMG1.jpg', 'output').then(value => {
                assert.called(methodSpy);
                assert.called(sendMediaCmdStub);
                assert.called(onStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            let buffer1 = Buffer.from('Rolling_Spider_IMG1.jpg \n Rolling_Spider_IMG2.jpg \n MD5');
            let buffer2 = Buffer.from('Rolling_Spider_IMG1.jpg \n Rolling_Spider_IMG2.jpg \n End of Transfer');

            miniDroneView.droneController.emit('media-data', {
                state: 'GET',
                data: buffer1
            });

            setTimeout(() => {
                miniDroneView.droneController.emit('media-data', {
                    state: 'MD5 OK',
                    data: buffer2
                });
            }, 1000);

            miniDroneView.downloadPicture.restore();
            miniDroneView.droneController.on.restore();
        });
    });

    describe("test method: deletePicture", () => {
        it("test if exists", () => {
            expect(miniDroneView.deletePicture).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'deletePicture');

            miniDroneView.deletePicture('Rolling_Spider_IMG1.jpg').then(value => {
                assert.called(methodSpy);
                assert.called(sendMediaCmdStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            let buffer1 = Buffer.from('Delete Successful');
            let buffer2 = Buffer.from('Delete Successful');

            miniDroneView.droneController.emit('media-data', {
                state: 'DEL',
                data: buffer1
            });

            miniDroneView.droneController.emit('media-data', {
                state: 'DEL',
                data: buffer2
            });

            miniDroneView.deletePicture.restore();
        });

        it("test if method is called with the success message delayed", (done) => {
            let methodSpy = spy(miniDroneView, 'deletePicture');

            miniDroneView.deletePicture('Rolling_Spider_IMG1.jpg').then(value => {
                assert.called(methodSpy);
                assert.called(sendMediaCmdStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            let buffer1 = Buffer.from('Delete Successful');
            let buffer2 = Buffer.from('Delete Successful');

            miniDroneView.droneController.emit('media-data', {
                state: 'DEL',
                data: buffer1
            });

            setTimeout(() => {
                miniDroneView.droneController.emit('media-data', {
                    state: 'DEL',
                    data: buffer2
                });
            }, 1000);

            miniDroneView.deletePicture.restore();
        });
    });

    describe("test method: land", () => {
        it("test if exists", () => {
            expect(miniDroneView.land).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'land');

            miniDroneView.land().then(value => {
                assert.called(methodSpy);
                assert.called(sendCmdStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.droneController.emit('flyingStateChanged', {
                state: 'landed'
            });
            miniDroneView.land.restore();
        });
    });

    describe("test method: disconnect", () => {
        it("test if exists", () => {
            expect(miniDroneView.disconnect).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'disconnect');

            miniDroneView.disconnect().then(value => {
                assert.called(methodSpy);
                assert.called(disconnectStub);
                expect(value).to.exist;
                expect(value).to.be.equal('success');
                done();
            }).catch(e => {
                assert.fail(e);
                done();
            });

            miniDroneView.disconnect.restore();
        });
    });

    describe("test method: getNavDataStream", () => {
        it("test if exists", () => {
            expect(miniDroneView.getNavDataStream).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'getNavDataStream'),
                createSpy = spy(Observable, 'create');

            let stream = miniDroneView.getNavDataStream();
            assert.called(methodSpy);
            assert.called(createSpy);
            expect(stream).to.exist;
            expect(stream.subscribe).to.exist;
            done();

            miniDroneView.getNavDataStream.restore();
        });
    });

    describe("test method: enableLogging", () => {
        it("test if exists", () => {
            expect(miniDroneView.enableLogging).to.exist;
        });

        it("test if method is called", (done) => {
            let methodSpy = spy(miniDroneView, 'enableLogging');

            miniDroneView.enableLogging('output').then(() => {
                assert.called(methodSpy);
            });
            done();

            miniDroneView.enableLogging.restore();
        });
    });
});

after(() => {
    miniDroneView.droneController.sendPilotingCommand.restore();
    miniDroneView.droneController.connect.restore();
    miniDroneView.droneController.checkAllStates.restore();
    miniDroneView.droneController.disconnect.restore();

    miniDroneView.droneController = null;
    miniDroneView = null;
});