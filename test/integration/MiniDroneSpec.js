import { MiniDroneView }        from '../../src/views/MiniDroneView';
import { debug }                from '../../src/utils/debug';
import { assert }    from 'sinon';

let miniDroneView = null,
    drone = 'RS_';

before(() => {
    miniDroneView = new MiniDroneView();
    miniDroneView.enableLogging();
});

describe("MiniDrone", () => {
    describe("test navdata stream", () => {
        it("test data", (done) => {

            let stream = miniDroneView.getNavDataStream();
            stream.subscribe((data) => {
                    debug('Navdata: ', data);
                },
                err => debug(err),
                () => debug('complete'));

            miniDroneView.connect(drone).then(value => {
                if (value === 'success') {
                    miniDroneView.checkAllStates().then(() => {
                        miniDroneView.disconnect().then(() => {
                            setTimeout(() => {
                                done();
                            }, 5000);
                        });
                    });
                }
            }).catch(e => {
                assert.fail(e);
                done();
            });
        });
    });

    describe("test listAllPictures", () => {
        it("test when method called", (done) => {
            miniDroneView.connect(drone).then(value => {
                if (value === 'success') {
                    miniDroneView.listAllPictures().then(data => {
                        done();
                    });
                }
            }).catch(e => {
                assert.fail(e);
                done();
            });
        });
    });

    describe("test takePicture", () => {
        it("test when method called", (done) => {
            let stream = miniDroneView.getNavDataStream();
            stream.subscribe((data) => {
                    debug('Navdata: ', data);
                },
                err => debug(err),
                () => debug('complete'));

            miniDroneView.connect(drone)
                .then(() => miniDroneView.flatTrim())
                .then(() => miniDroneView.takePicture())
                .then(() => {
                    setTimeout(() => {
                        done();
                    }, 10000);
                })
                .catch((e) => {
                    assert.fail(e);
                    console.log('Error occurred: ' + e);
                });
        });
    });

    describe("test downloadPicture", () => {
        it("test when method called", (done) => {
            let picList = null;

            let stream = miniDroneView.getNavDataStream();
            stream.subscribe((data) => {
                    debug('Navdata: ', data);
                },
                err => debug(err),
                () => debug('complete'));

            miniDroneView
                .connect(drone)
                .then(() => miniDroneView.listAllPictures())
                .then(pictures => {
                    picList = pictures;
                    return miniDroneView.downloadPicture(picList[0], 'output');
                })
                .then(response => {
                    if (response === 'success') {
                        console.log('first pic downloaded successfully...');
                        return miniDroneView.downloadPicture(picList[1], 'output');
                    }
                })
                .then(response => {
                    if (response === 'success') {
                        console.log('second pic downloaded successfully...');
                        return miniDroneView.downloadPicture(picList[2], 'output');
                    }
                })
                .then(response => {
                    if (response === 'success') {
                        console.log('third pic downloaded successfully...');
                        done();
                    }
                })
                .catch(e => {
                    console.log('Error occurred: ' + e);
                });
        });
    });

    describe("test deletePicture", () => {
        it("test when method called", (done) => {
            let picList = null;
            miniDroneView
                .connect(drone)
                .then(() => miniDroneView.listAllPictures())
                .then(pictures => {
                    picList = pictures;
                    return miniDroneView.deletePicture(picList[0]);
                })
                .then(response => {
                    return miniDroneView.deletePicture(picList[1]);
                })
                .then(response => {
                    return miniDroneView.deletePicture(picList[2]);
                })
                .then(() => {
                    console.log('second pic deleted');
                    done();
                })
                .catch(e => {
                    assert.fail(e);
                    done();
                });
        });
    });

    describe("test maneuvering", () => {
        it("test data", (done) => {
            let stream = miniDroneView.getNavDataStream();
            stream.subscribe((data) => {
                },
                err => debug(err),
                () => debug('complete'));

            miniDroneView.connect(drone)
                .then(() => miniDroneView.flatTrim())
                .then(() => miniDroneView.takeOff())
                .then(() => miniDroneView.flatTrim())
                .then(() => miniDroneView.forward(50, 8))
                .then(() => miniDroneView.flatTrim())
                .then(() => miniDroneView.land())
                .then(() => {
                    done();
                })
                .catch((e) => {
                    assert.fail(e);
                    done();
                });
        });
    });
});

after(() => {
    miniDroneView.droneController = null;
    miniDroneView = null;
});
