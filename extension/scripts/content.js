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

  chrome.runtime.sendMessage({ methodName: 'startup' }, response => { 
    if (response.errorMessage) {
      alert(response.errorMessage);
      return;
    }
    if (!response.deviceData || !response.deviceData.deviceAssetId || !response.deviceData.deviceSerialNumber) {
      alert('deviceAssetId and/or deviceSerialNumber not found through chrome API');
      return;
    }
    alert('device asset id: ' + response.deviceData.deviceAssetId + '\ndevice serial number: ' + response.deviceData.deviceSerialNumber);
    const value = document.createElement('h1').innerHTML = `Device Asset ID: ${response.deviceData.deviceAssetId}<br>Device Serial Number: ${response.deviceData.deviceSerialNumber}`;
    const test = document.createElement('h1').innerHTML = "Does this work??????";
    document.body.appendChild(value);
    document.body.appendChild(test);
  });
  //setRestartDeviceTimeout();
  
  chrome.runtime.sendMessage({ methodName: "log", message: "Ran startup." }, response => { alert(response) });
}

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
