import { MiniDroneView }        from '../../src/views/MiniDroneView';
import { debug }                from '../../src/utils/debug';

let miniDroneView = null;

before(() => {
    miniDroneView = new MiniDroneView();
    miniDroneView.enableLogging();
});

describe("MiniDroneView", () => {
    // describe("test navdata stream", () => {
    //     it("test data", (done) => {
    //
    //         let stream = miniDroneView.getNavDataStream();
    //         stream.subscribe((data) => {
    //                 debug('Navdata: ', data);
    //             },
    //             err => debug(err),
    //             () => debug('complete'));
    //
    //         miniDroneView.connect('Mars_').then(value => {
    //             if (value === 'success') {
    //                 miniDroneView.checkAllStates().then(value => {
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

    // describe("test navdata stream", () => {
    //     it("test data", (done) => {
    //
    //         let stream = miniDroneView.getNavDataStream();
    //         stream.subscribe((data) => {
    //                 debug('Navdata: ', data);
    //             },
    //             err => debug(err),
    //             () => debug('complete'));
    //
    //         miniDroneView.connect('Mars_').then(value => {
    //             if (value === 'success') {
    //                 miniDroneView.checkAllSettings().then(value => {
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


    describe("test listAllPictures", () => {
        it("test when method called", (done) => {
            miniDroneView.connect('Mars_').then(value => {
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

    // describe("test takePicture", () => {
    //     it("test when method called", (done) => {
    //         miniDroneView.enableLogging();
    //
    //         let stream = miniDroneView.getNavDataStream();
    //         stream.subscribe((data) => {
    //                 debug('Navdata: ', data);
    //             },
    //             err => debug(err),
    //             () => debug('complete'));
    //
    //         miniDroneView.connect('Mars_')
    //             .then(() => miniDroneView.flatTrim())
    //             .then(() => miniDroneView.takePicture())
    //             .then(() => {
    //                 setTimeout(() => {
    //                     done();
    //                 }, 10000);
    //             })
    //             .catch((e) => {
    //                 assert.fail(e);
    //                 console.log('Error occurred: ' + e);
    //             });
    //     });
    // });

    // describe("test downloadPicture", () => {
    //     it("test when method called", (done) => {
    //         let picList = null;
    //         miniDroneView
    //             .connect('Mars_')
    //             .then(() => miniDroneView.listAllPictures())
    //             .then(pictures => {
    //                 picList = pictures;
    //                 return miniDroneView.downloadPicture(picList[2], 'output');
    //             })
    //             .then(response => {
    //                 if (response === 'success') {
    //                     console.log('first pic downloaded successfully...');
    //                     return miniDroneView.downloadPicture(picList[1], 'output');
    //                 }
    //             })
    //             .then(response => {
    //                 if (response === 'success') {
    //                     console.log('second pic downloaded successfully...');
    //                     return miniDroneView.downloadPicture(picList[2], 'output');
    //                 }
    //             })
    //             .then(response => {
    //                 if (response === 'success') {
    //                     console.log('third pic downloaded successfully...');
    //                 }
    //             })
    //             .catch(e => {
    //                 console.log('Error occurred: ' + e);
    //             });
    //     });
    // });

    // describe("test deletePicture", () => {
    //     it("test when method called", (done) => {
    //         let picList = null;
    //         miniDroneView
    //             .connect('Mars_')
    //             .then(() => miniDroneView.listAllPictures())
    //             .then(pictures => {
    //                 picList = pictures;
    //                 return miniDroneView.deletePicture(picList[0]);
    //             })
    //             .then(() => {})
    //             .catch(e => {
    //                 assert.fail(e);
    //                 done();
    //             });
    //     });
    // });

    // describe("test logging", () => {
    //     it("test data", (done) => {
    //
    //         miniDroneView.enableLogging();
    //
    //         let stream = miniDroneView.getNavDataStream();
    //         stream.subscribe((data) => {
    //                 debug('Navdata: ', data);
    //             },
    //             err => debug(err),
    //             () => debug('complete'));
    //
    //         miniDroneView.connect('Mars_').then(value => {
    //             if (value === 'success') {
    //                 miniDroneView.checkAllStates().then(value => {
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

    // describe("test logging", () => {
    //     it("test data", (done) => {
    //         let stream = miniDroneView.getNavDataStream();
    //         stream.subscribe((data) => {
    //             },
    //             err => debug(err),
    //             () => debug('complete'));
    //
    //         miniDroneView.connect('Mars_')
    //             .then(() => miniDroneView.flatTrim())
    //             .then(() => miniDroneView.takeOff())
    //             .then(() => miniDroneView.flatTrim())
    //             // .then(() => minidrone.up(50, 8))
    //             // .then(() => minidrone.flatTrim())
    //             // .then(() => minidrone.leftFlip())
    //             .then(() => miniDroneView.land())
    //             .then(() => {
    //                 done();
    //             })
    //             .catch((e) => {
    //                 assert.fail(e);
    //                 done();
    //             });
    //     });
    // });
});

after(() => {
    miniDroneView.droneController = null;
    miniDroneView = null;
});