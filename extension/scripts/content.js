// This file mimics a PWA content script. It is used just to test the functionality of the messaging system for now.
    // After the PWA is created, a script similar to this would be used.
    // NOTE: In the manifest, need to set the matches for content scripts to the PWA url only

/**
    A basic rundown of how the messaging system works:
1. The PWA sends a message to the background script with the following parameters:
    - A request object that contains a methodName property and possibly other properties if necessary.
    - A callback function that will be called with a response object or undefined as the arg
2. The extension receives this message and calls the corresponding function and calls the callback function
3. The PWA receives the response object or undefined through the callback function and can do whatever it wants with it
    */

    /**
    * @description Function that should be run on the PWA startup.
    * Sends a message through the chrome runtime API and specifies a callback function with a response that 
    * should contain the deviceAssetId and deviceSerialNumber
    */
    const onKioskPWAStartup = async function() {
        alert('PWA has started up! Sending message to extension');

        chrome.runtime.sendMessage({ methodName: 'startup' }, response => {  });
        //setRestartDeviceTimeout();

        //chrome.runtime.sendMessage({ methodName: "log", message: "Ran startup." }, response => { alert(response) });
        alert('End of onKioskPWAStartup');
    }

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        alert('In callback from extension. Response:' + request);
        if (!request.deviceData) {
            alert('deviceData is undefined.');
            if (request.errorMessage) alert(request.errorMessage);
            return;
        }
        if (!request.deviceData.deviceAssetId || !request.deviceData.deviceSerialNumber) {
            alert('deviceAssetId and/or deviceSerialNumber not found through chrome API');
            alert('Response.deviceData: ' + request.deviceData);
            alert(`Response.deviceData.deviceAssetId: ${request.deviceData.deviceAssetId}`);
            alert(`Response.deviceData.deviceSerialNumber: ${request.deviceData.deviceSerialNumber}`);
            return;
        }
        if (request.errorMessage) {
            alert(`Error: ${request.errorMessage}`);
        }
        alert('device asset id: ' + request.deviceData.deviceAssetId + '\ndevice serial number: ' + request.deviceData.deviceSerialNumber);

    }
);

/**
    * @description Function that sets a timeout to restart the device at 3am
    * This should also be run by on the PWA's startup
    */
    const setRestartDeviceTimeout = async function() {
        var now = new Date();
        var millisTill3 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 0, 0, 0) - now;
        if (millisTill3 < 0) {
            millisTill3 += 86400000; // it's after 3am, try 3am tomorrow.
        }
        setTimeout(() => {
            chrome.runtime.sendMessage({ methodName: 'restartDevice' }, response => { console.log(response) });
        }, millisTill3);
        console.log(`Device will restart in ${millisTill3} ms. Or ${millisTill3 / 1000 / 60 / 60} hours. Or ${millisTill3 / 1000 / 60 / 60 / 24} days.`)
    }

onKioskPWAStartup();
