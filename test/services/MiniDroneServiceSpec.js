import { expect, assert } from 'chai';
import { MiniDroneService } from '../../src/services/MiniDroneService';

let miniDroneService = null;

before(() => {
    miniDroneService = new MiniDroneService();
});

describe("MiniDroneService", () => {

    it("test if exists", () => {
        expect(miniDroneService).to.exist;
    });

    it("test if connect method exists", () => {
        expect(miniDroneService.connect).to.exist;
    });

    it("test if drone gets connected", (done) => {
        miniDroneService.connect("RS").then((value) => {
            expect(miniDroneService.drone).to.exist;
            expect(miniDroneService.drone.connect).to.exist;
            done();
        }).catch((e) => {
            assert.ifError(e);
            done();
        });
    });

    it("test if drone gets disconnected", (done) => {
        miniDroneService.disconnect().then((value) => {
            assert.isOk(value);
            done();
        }).catch((e) => {
            assert.ifError(e);
            done();
        });
    });
});

after(() => {
    miniDroneService = null;
});