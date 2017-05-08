import { expect }               from 'chai';
import { assert, spy, stub }    from 'sinon';

import { MiniDroneController } from '../../src/controllers/MiniDroneController';

let miniDroneController = null;

before(() => {
    miniDroneController = new MiniDroneController();
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
            miniDroneController.connect('RS_').then(value => {
                if (value === 'success') {
                    miniDroneController.checkAllStates().then(value => {
                        if (value === 'success') {
                            setTimeout(() => {
                                console.log('Test Completed!');
                                done();
                            }, 10000);
                        }
                    });
                }
            });
        });
    });
});

after(() => {
    miniDroneController = null;
});