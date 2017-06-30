import { MiniDroneView }        from '../../src/views/MiniDroneView';
import { debug }                from '../../src/utils/debug';

let miniDroneView = null;

before(() => {
    miniDroneView = new MiniDroneView();
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
    //         miniDroneView.connect('RS_').then(value => {
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
    //
    // describe("test listAllPictures", () => {
    //     it("test when method called", (done) => {
    //         miniDroneView.connect('RS_').then(value => {
    //             if (value === 'success') {
    //                 miniDroneView.listAllPictures().then(data => {
    //                     debug(data);
    //                     done();
    //                 });
    //             }
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //     });
    // });
    //
    // describe("test downloadPicture", () => {
    //     it("test when method called", (done) => {
    //         let picList = null;
    //         miniDroneView
    //             .connect('RS_')
    //             .then(() => miniDroneView.listAllPictures())
    //             .then(pictures => {
    //                 picList = pictures;
    //                 return miniDroneView.downloadPicture(picList[0], 'output');
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
    //
    // describe("test deletePicture", () => {
    //     it("test when method called", (done) => {
    //         miniDroneView.connect('RS_').then(value => {
    //             if (value === 'success') {
    //                 miniDroneView.deletePicture('Rolling_Spider_1970-01-01T000025+0000_.jpg').then(response => {
    //                     if (response === 'success') {
    //                         done();
    //                     }
    //                 });
    //             }
    //         }).catch(e => {
    //             assert.fail(e);
    //             done();
    //         });
    //     });
    // });

    describe("test logging", () => {
        it("test data", (done) => {

            miniDroneView.enableLogging('/Users/ctsuser/labSpace/DroneJS/output');

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
    miniDroneView.droneController = null;
    miniDroneView = null;
});