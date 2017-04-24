import { MiniDroneService } from '../controllers/MiniDroneService';

export class MiniDroneController {

    constructor() {
        this.droneService = new MiniDroneService();
    }

    connect(droneIdentifier) {
        this.droneService.connect(droneIdentifier).then((value) => {
            console.log(value);
        }).catch((e) => {
            console.log(e);
        })
    }

    disconnect() {
        this.droneService.disconnect().then((value) => {
            console.log(value);
        }).catch((e) => {
            console.log(e);
        })
    }
}