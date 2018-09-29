import UA from 'universal-analytics';

export class Tracker {

    constructor() {
        this.track = UA('UA-125923640-1');
        this.category = null;
    }

    report(action) {
        this.track.event(this.category, action).send();
    }

    setCategory(id) {
        this.category = id;
    }
}
