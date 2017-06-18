# DroneJS
A Node.js based library for controlling a Parrot minidrone. The library also provides the feature to take pictures from the drone, download them all at a time and delete them whenever required. The library follows Bluetooth LE networking protocol to connect to the drone. 

## Drones Supported

* Parrot Rolling Spider
* Parrot Airborne Night Maclane
* Parrot Airborne Night Blaze
* Parrot Airborne Night Swat
* Parrot Airborne Cargo Mars
* Parrot Airborne Cargo Travis

## Prerequisites

* See [noble prerequisites](https://github.com/sandeepmistry/noble#prerequisites) for your platform
* Node.js 6.5 or higher

## Install

```

npm install dronejs

```

## Usage

### Connect

To connect to drone, you need to instantiate the MiniDrone class and then call its **connect** method.

```
var minidrone = require('dronejs');

minidrone.connect('RS_')
        .then()
        .catch((e) => {
            console.log('Error occurred: ' + e);
        });
```

### Setup Navdata Stream

To listen to the navigation data from the drone, you need to call the **getNavDataStream** function and then subscribe to the object returned from it.

```
var minidrone = require('dronejs');

var navDataStream = minidrone.getNavDataStream();
navDataStream.subscribe((data) => {
        console.log(data);
    },
    err => debug(err),
    () => debug('complete'));


minidrone.connect('RS_')
    .then(() => minidrone.checkAllStates())
    .then()
    .catch((e) => {
        console.log('Error occurred: ' + e);
    });
```

### Basic Maneuvers

```
var minidrone = require('dronejs');

var navDataStream = minidrone.getNavDataStream();
navDataStream.subscribe((data) => {
        console.log(data);
    },
    err => debug(err),
    () => debug('complete'));


minidrone.connect('RS_')
    .then(() => minidrone.flatTrim())
    .then(() => minidrone.takeOff())
    .then(() => minidrone.flatTrim())
    .then(() => minidrone.forward(50, 5))
    .then(() => minidrone.flatTrim())
    .then(() => minidrone.land())
    .then()
    .catch((e) => {
        console.log('Error occurred: ' + e);
    });
```

### Take Picture

```
var minidrone = require('dronejs');

var navDataStream = minidrone.getNavDataStream();
navDataStream.subscribe((data) => {
        console.log(data);
    },
    err => debug(err),
    () => debug('complete'));


minidrone.connect('RS_')
    .then(() => minidrone.flatTrim())
    .then(() => minidrone.takeOff())
    .then(() => minidrone.flatTrim())
    .then(() => minidrone.takePicture())
    .then(() => minidrone.flatTrim())
    .then(() => minidrone.land())
    .then()
    .catch((e) => {
        console.log('Error occurred: ' + e);
    });
```

### Download Pictures

```
var minidrone = require('dronejs');

minidrone.connect('RS_')
    .then(() => minidrone.listAllPictures())
    .then(pictures => minidrone.downloadPicture(pictures[0], 'output'))
    .then(response => {
        if (response === 'success') {
            console.log('picture downloaded successfully...');
        }
    })
    .catch((e) => {
        console.log('Error occurred: ' + e);
    });
```

### Delete Picture

```
var minidrone = require('dronejs');

minidrone.connect('RS_')
    .then(() => minidrone.listAllPictures())
    .then(pictures => minidrone.deletePicture(pictures[0]))
    .then(response => {
        if (response === 'success') {
            console.log('picture deleted successfully...');
        }
    })
    .catch((e) => {
        console.log('Error occurred: ' + e);
    });
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

* **turnLeft(intensity, frequency)**

    Turn the drone to left
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **frequency** - Number of times drone should perform this action.

* **turnRight(intensity, frequency)**

    Turn the drone to right
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **frequency** - Number of times drone should perform this action.

* **backward(intensity, frequency)**

    Move the drone backward
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **frequency** - Number of times drone should perform this action.

* **forward(intensity, frequency)**

    Move the drone forward
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **frequency** - Number of times drone should perform this action.

* **left(intensity, frequency)**

    Move the drone to left
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **frequency** - Number of times drone should perform this action.

* **right(intensity, frequency)**

    Move the drone to right
    
    > **intensity** - Intensity with which the turn should happen. 
    >
    > **frequency** - Number of times drone should perform this action.

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