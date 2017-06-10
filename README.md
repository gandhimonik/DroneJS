# DroneJS
A Node.js based library for controlling a Parrot Rolling Spider drone. This library follows Bluetooth LE networking protocol to connect to the drone. 

## Prerequisites

* See[noble prerequisites](https://github.com/sandeepmistry/noble#prerequisites)for your platform
* Node.js 6.5 or higher

## Install

```
npm install dronejs

```

## Usage

### Connect

To connect to drone, you need to instantiate the MiniDrone class and then call its **connect** method.

```
import { MiniDrone }    from 'dronejs';

class SimpleFlight {

    constructor() {
        this.minidrone = new MiniDrone();
    }

    connect() {
        this.minidrone
            .connect('RS_')
            .then(response => {
                if (response === 'success') {
                    console.log('drone connected successfully...');
                }
            })
            .catch((e) => {
                console.log('Error occurred: ' + e);
            });
    }
}

let simpleFlight = new SimpleFlight();
simpleFlight.connect();
```

### Setup Navdata Stream

To listen to the navigation data from the drone, you need to call the **getNavDataStream** function and then subscribe to the object returned from it.

```
import { MiniDrone }    from 'dronejs';

class SimpleFlight {

    constructor() {
        this.minidrone = new MiniDrone();
    }

    setupDataStream() {
        let navDataStream = this.minidrone.getNavDataStream();
        navDataStream.subscribe((data) => {
                console.log(data);
            },
            err => debug(err),
            () => debug('complete'));
    }

    connect() {
        this.minidrone
            .connect('RS_')
            .then(() => this.minidrone.checkAllStates())
            .then()
            .catch((e) => {
                console.log('Error occurred: ' + e);
            });
    }
}

let simpleFlight = new SimpleFlight();
simpleFlight.setupDataStream();
simpleFlight.connect();
```

### Basic Maneuvers

```
import { MiniDrone }    from 'dronejs';

class SimpleFlight {

    constructor() {
        this.minidrone = new MiniDrone();
    }

    setupDataStream() {
        let navDataStream = this.minidrone.getNavDataStream();
        navDataStream.subscribe((data) => {
                console.log(data);
            },
            err => debug(err),
            () => debug('complete'));
    }

    run() {
        this.minidrone
            .connect('RS_')
            .then(() => this.minidrone.flatTrim())
            .then(() => this.minidrone.takeOff())
            .then(() => this.minidrone.flatTrim())
            .then(() => this.minidrone.goForward(50, 2000))
            .then(() => this.minidrone.flatTrim())
            .then(() => this.minidrone.land())
            .catch(e => {
                console.log('Error occurred: ' + e);
            });
    }
}

let simpleFlight = new SimpleFlight();
simpleFlight.setupDataStream();
simpleFlight.run();
```

### Take Picture

```
import { MiniDrone }    from 'dronejs';

class SimpleFlight {

    constructor() {
        this.minidrone = new MiniDrone();
    }

    setupDataStream() {
        let navDataStream = this.minidrone.getNavDataStream();
        navDataStream.subscribe((data) => {
                console.log(data);
            },
            err => debug(err),
            () => debug('complete'));
    }

    run() {
        this.minidrone
            .connect('RS_')
            .then(() => this.minidrone.flatTrim())
            .then(() => this.minidrone.takeOff())
            .then(() => this.minidrone.flatTrim())
            .then(() => this.minidrone.takePicture())
            .then(() => this.minidrone.flatTrim())
            .then(() => this.minidrone.land())
            .catch(e => {
                console.log('Error occurred: ' + e);
            });
    }
}

let simpleFlight = new SimpleFlight();
simpleFlight.setupDataStream();
simpleFlight.run();
```

### Download Pictures

```
import { MiniDrone }    from 'dronejs';

class SimpleFlight {

    constructor() {
        this.minidrone = new MiniDrone();
    }

    setupDataStream() {
        let navDataStream = this.minidrone.getNavDataStream();
        navDataStream.subscribe((data) => {
                console.log(data);
            },
            err => debug(err),
            () => debug('complete'));
    }

    run() {
        this.minidrone
            .connect('RS_')
            .then(() => this.minidrone.listAllPictures())
            .then(pictures => this.minidrone.downloadPicture(pictures[0], 'output'))
            .then(response => {
                if (response === 'success') {
                    console.log('picture downloaded successfully...');
                }
            })
            .catch(e => {
                console.log('Error occurred: ' + e);
            });
    }
}

let simpleFlight = new SimpleFlight();
simpleFlight.setupDataStream();
simpleFlight.run();
```

### Delete Picture

```
import { MiniDrone }    from 'dronejs';

class SimpleFlight {

    constructor() {
        this.minidrone = new MiniDrone();
    }

    setupDataStream() {
        let navDataStream = this.minidrone.getNavDataStream();
        navDataStream.subscribe((data) => {
                console.log(data);
            },
            err => debug(err),
            () => debug('complete'));
    }

    run() {
        this.minidrone
            .connect('RS_')
            .then(() => this.minidrone.listAllPictures())
            .then(pictures => this.minidrone.deletePicture(pictures[0]))
            .then(response => {
                if (response === 'success') {
                    console.log('picture deleted successfully...');
                }
            })
            .catch(e => {
                console.log('Error occurred: ' + e);
            });
    }
}

let simpleFlight = new SimpleFlight();
simpleFlight.setupDataStream();
simpleFlight.run();
```

## API

* **drone.connect(droneIdentifier)**

    Connect the device to the drone.
    
    > **droneIdentifier** - Local name of the drone as per the advertisement through Bluetooth or UUID of the drone.

* **getNavDataStream()**

    Get the stream of navigation data from the drone.

* **checkAllStates()**

    Check the device state including the battery percentage.

* **flatTrim()**

    Stabilize the drone.

* **takeOff()**

    Do a drone take off

* **turnLeft(intensity, duration)**

    Turn the drone to left
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **duration** - Duration until which the drone should perform this action.

* **turnRight(intensity, duration)**

    Turn the drone to right
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **duration** - Duration until which the drone should perform this action.

* **goBackward(intensity, duration)**

    Move the drone backward
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **duration** - Duration until which the drone should perform this action.

* **goForward(intensity, duration)**

    Move the drone forward
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **duration** - Duration until which the drone should perform this action.

* **goLeft(intensity, duration)**

    Move the drone to left
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **duration** - Duration until which the drone should perform this action.

* **goRight(intensity, duration)**

    Move the drone to right
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **duration** - Duration until which the drone should perform this action.

* **frontFlip()**

    Make the drone do a front flip

* **backFlip()**

    Make the drone do a back flip

* **rightFlip()**

    Make the drone do a right flip

* **leftFlip()**

    Make the drone do a left flip

* **takePicture()**

    Take the picture from the drone during flight

* **listAllPictures()**

    List all the pictures taken from the drone

* **downloadPicture(name, downloadPath)**

    Download a picture
    
    > **name** - Name of the picture as per the one returned while calling **listAllPictures**. 
    >
    > **downloadPath** - Folder path to store the picture.

* **deletePicture(name)**

    Delete a picture
    
    > **name** - Name of the picture as per the one returned while calling **listAllPictures**.

* **land()**

    Make the drone land

* **disconnect()**

    Disconnect the drone