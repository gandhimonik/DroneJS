import { expect }               from 'chai';
import { assert, spy, stub }    from 'sinon';

import { MiniDroneView }        from '../../src/views/MiniDroneView';
import { debug }                from '../../src/utils/debug';

let miniDroneView = null,
    fakePromise,
    sendCmdStub,
    connectStub,
    checkStateStub,
    disconnectStub;

before(() => {
    miniDroneView = new MiniDroneView();
    fakePromise = {
        then: function(fn) {
            fn();
            return {
                catch: function() {}
            }
        },
        // catch: function() { }
    };

    // sendCmdStub = stub(miniDroneView.droneController, 'sendPilotingCommand').callsFake(() => fakePromise);
    // connectStub = stub(miniDroneView.droneController, 'connect').callsFake(() => fakePromise);
    // checkStateStub = stub(miniDroneView.droneController, 'checkAllStates').callsFake(() => fakePromise);
    // disconnectStub = stub(miniDroneView.droneController, 'disconnect').callsFake(() => fakePromise);
});

describe("MiniDroneView", () => {

    it("test if exists", () => {
        expect(miniDroneView).to.exist;
    });

    it("test if all the properties are initialized", () => {
        expect(miniDroneView.droneController).to.exist;
    });

    // describe("test method: connect", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.connect).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'connect');
    //
    //         miniDroneView.connect('RS_').then(value => {
    //             assert.called(methodSpy);
    //             assert.called(connectStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.connect.restore();
    //     });
    // });
    //
    // describe("test method: checkAllStates", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.checkAllStates).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'checkAllStates');
    //
    //         miniDroneView.checkAllStates().then(value => {
    //             assert.called(methodSpy);
    //             assert.called(checkStateStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.checkAllStates.restore();
    //     });
    // });
    //
    // describe("test method: flatTrim", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.flatTrim).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let flatTrimSpy = spy(miniDroneView, 'flatTrim');
    //
    //         miniDroneView.flatTrim().then(value => {
    //             assert.called(flatTrimSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.flatTrim.restore();
    //     });
    // });
    //
    // describe("test method: takeOff", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.takeOff).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'takeOff');
    //
    //         miniDroneView.takeOff().then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.takeOff.restore();
    //     });
    // });
    //
    // describe("test method: turnLeft", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.turnLeft).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'turnLeft');
    //
    //         miniDroneView.turnLeft(-50, 500).then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.turnLeft.restore();
    //     });
    //
    //     it("test if method is called with wrong intensity", (done) => {
    //         let methodSpy = spy(miniDroneView, 'turnLeft');
    //
    //         miniDroneView.turnLeft(10, 500).then(value => {
    //             done();
    //         }).catch(e => {
    //             assert.called(methodSpy);
    //             expect(e).to.exist;
    //             expect(e).to.be.equal('Error: Value for intensity should be between -100 and 0');
    //             done();
    //         });
    //
    //         miniDroneView.turnLeft.restore();
    //     });
    // });
    //
    // describe("test method: turnRight", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.turnRight).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'turnRight');
    //
    //         miniDroneView.turnRight(50, 500).then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.turnRight.restore();
    //     });
    //
    //     it("test if method is called with wrong intensity", (done) => {
    //         let methodSpy = spy(miniDroneView, 'turnRight');
    //
    //         miniDroneView.turnRight(-10, 500).then(value => {
    //             done();
    //         }).catch(e => {
    //             assert.called(methodSpy);
    //             expect(e).to.exist;
    //             expect(e).to.be.equal('Error: Value for intensity should be between 1 and 100');
    //             done();
    //         });
    //
    //         miniDroneView.turnRight.restore();
    //     });
    // });
    //
    // describe("test method: goBackward", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.goBackward).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'goBackward');
    //
    //         miniDroneView.goBackward(-50, 500).then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.goBackward.restore();
    //     });
    //
    //     it("test if method is called with wrong intensity", (done) => {
    //         let methodSpy = spy(miniDroneView, 'goBackward');
    //
    //         miniDroneView.goBackward(10, 500).then(value => {
    //             done();
    //         }).catch(e => {
    //             assert.called(methodSpy);
    //             expect(e).to.exist;
    //             expect(e).to.be.equal('Error: Value for intensity should be between -100 and 0');
    //             done();
    //         });
    //
    //         miniDroneView.goBackward.restore();
    //     });
    // });
    //
    // describe("test method: goForward", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.goForward).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'goForward');
    //
    //         miniDroneView.goForward(50, 500).then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.goForward.restore();
    //     });
    //
    //     it("test if method is called with wrong intensity", (done) => {
    //         let methodSpy = spy(miniDroneView, 'goForward');
    //
    //         miniDroneView.goForward(-10, 500).then(value => {
    //             done();
    //         }).catch(e => {
    //             assert.called(methodSpy);
    //             expect(e).to.exist;
    //             expect(e).to.be.equal('Error: Value for intensity should be between 1 and 100');
    //             done();
    //         });
    //
    //         miniDroneView.goForward.restore();
    //     });
    // });
    //
    // describe("test method: goLeft", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.goLeft).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'goLeft');
    //
    //         miniDroneView.goLeft(-50, 500).then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.goLeft.restore();
    //     });
    //
    //     it("test if method is called with wrong intensity", (done) => {
    //         let methodSpy = spy(miniDroneView, 'goLeft');
    //
    //         miniDroneView.goLeft(10, 500).then(value => {
    //             done();
    //         }).catch(e => {
    //             assert.called(methodSpy);
    //             expect(e).to.exist;
    //             expect(e).to.be.equal('Error: Value for intensity should be between -100 and 0');
    //             done();
    //         });
    //
    //         miniDroneView.goLeft.restore();
    //     });
    // });
    //
    // describe("test method: goRight", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.goRight).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'goRight');
    //
    //         miniDroneView.goRight(50, 500).then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.goRight.restore();
    //     });
    //
    //     it("test if method is called with wrong intensity", (done) => {
    //         let methodSpy = spy(miniDroneView, 'goRight');
    //
    //         miniDroneView.goRight(-10, 500).then(value => {
    //             done();
    //         }).catch(e => {
    //             assert.called(methodSpy);
    //             expect(e).to.exist;
    //             expect(e).to.be.equal('Error: Value for intensity should be between 1 and 100');
    //             done();
    //         });
    //
    //         miniDroneView.goRight.restore();
    //     });
    // });
    //
    // describe("test method: frontFlip", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.frontFlip).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'frontFlip');
    //
    //         miniDroneView.frontFlip().then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.frontFlip.restore();
    //     });
    // });
    //
    // describe("test method: backFlip", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.backFlip).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'backFlip');
    //
    //         miniDroneView.backFlip().then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.backFlip.restore();
    //     });
    // });
    //
    // describe("test method: leftFlip", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.leftFlip).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'leftFlip');
    //
    //         miniDroneView.leftFlip().then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.leftFlip.restore();
    //     });
    // });
    //
    // describe("test method: rightFlip", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.rightFlip).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'rightFlip');
    //
    //         miniDroneView.rightFlip().then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.rightFlip.restore();
    //     });
    // });
    //
    // describe("test method: land", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.land).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'land');
    //
    //         miniDroneView.land().then(value => {
    //             assert.called(methodSpy);
    //             assert.called(sendCmdStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.land.restore();
    //     });
    // });
    //
    // describe("test method: disconnect", () => {
    //     it("test if exists", () => {
    //         expect(miniDroneView.disconnect).to.exist;
    //     });
    //
    //     it("test if method is called", (done) => {
    //         let methodSpy = spy(miniDroneView, 'disconnect');
    //
    //         miniDroneView.disconnect().then(value => {
    //             assert.called(methodSpy);
    //             assert.called(disconnectStub);
    //             expect(value).to.exist;
    //             expect(value).to.be.equal('success');
    //             done();
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //
    //         miniDroneView.disconnect.restore();
    //     });
    // });

    describe("test navdata stream", () => {
        it("test data", (done) => {

            let stream = miniDroneView.getNavDataStream();
            stream.subscribe((data) => {
                    debug('Navdata: ', data);
                },
                err => debug(err),
                () => debug('complete'));

            miniDroneView.connect('RS_').then(value => {
                if (value === 'success') {
                    miniDroneView.checkAllStates().then(value => {
                        setTimeout(() => {
                            done();
                        }, 10000);
                    });
                }
            }).catch(e => {
                assert.fail(e);
                done();
            });
        });
    });
});

after(() => {
    // miniDroneView.droneController.sendPilotingCommand.restore();
    // miniDroneView.droneController.connect.restore();
    // miniDroneView.droneController.checkAllStates.restore();
    // miniDroneView.droneController.disconnect.restore();

    miniDroneView.droneController = null;
    miniDroneView = null;
});