/**
    Developer notes:
    - In production, the manifest needs to have "kiosk_only": true, and the content_script's matches needs to match the PWA url only.
    This ensures only the PWA can send messages to the background script.
    */



/**
    * @description Startup function that returns the deviceAssetId and deviceSerialNumber to the message sender
    * @param {*} request Request passed from the onMessageListener
    * @param {*} sender Sender passed from the onMessageListener
    * @returns An object with deviceData and possibly an errorMessage. deviceData contains the deviceAssetId and deviceSerialNumber.
    * They are a string (double check this) or undefined
    */
    const startup = async function(request, sender) {
        // NOTE: The chrome.enterprise.deviceAttributes only works if two conditions are met:
        // 1. The device is running ChromeOS
        // 2. The extension is pre-installed by policy
        
        // These functions are responsible for sending the deviceAssetId and deviceSerialNumber to the PWA
        getDeviceAssetId();
        getSerialNumber();
    }

const getDeviceAssetId = async function(request, sender) {
    try {
        chrome.enterprise.deviceAttributes.getDeviceAssetId(deviceAssetIdCallback);
    } catch (err) {
        sendMessageToPWA({ methodName: 'deviceAssetIdCallback', assetId: undefined, errorMessage: err.message });
    }
}

const getSerialNumber = async function(request, sender) {
    try {
        chrome.enterprise.deviceAttributes.getDeviceSerialNumber(deviceSerialNumberCallback);
    } catch (err) {
        sendMessageToPWA({ methodName: 'deviceSerialNumberCallback', serialNumber: undefined, errorMessage: err.message });
    }
}

const deviceAssetIdCallback = async function(assetIdString) {
    sendMessageToPWA({ methodName: 'deviceAssetIdCallback', assetId: assetIdString });
}

const deviceSerialNumberCallback = async function(serialNumberString) {
    sendMessageToPWA({ methodName: 'deviceSerialNumberCallback', serialNumber: serialNumberString });
}

const restartDevice = async function(request, sender) {
    // takes a number of seconds to wait before restarting
    // if -1, the reboot is cancelled
    // if called again, it is delayed
    // 60 seconds for now just to ensure it works, after I will set it up to restart at 3 am when called
    try {
        chrome.runtime.restartAfterDelay(
            60,
            restartCallback
        )
    } catch (err) {
        sendMessageToPWA({ methodName: 'restartCallback', errorMessage: err.message });
    }
}

const restartCallback = async function() {
    sendMessageToPWA({ methodName: 'restartCallback', errorMessage: undefined });
}

chrome.runtime.onMessage.addListener(
    /**
    @summary Function responsible for listening to messages from the PWA.
    @callback sendResponse Callback with a single parameter. A response object or undefined
    */
    async function(request, sender, sendResponse) {
        let res = undefined;

        if (request.methodName === 'startup') {
            startup(request, sender);
        } else if (request.methodName === 'restartDevice') {
            restartDevice(request, sender);
        } else if (request.methodName === 'log') {
            res = await log(request, sender);
        }
        if (res) sendMessageToPWA(res);
    }
);

const sendMessageToPWA = async function(message) {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = chrome.tabs.sendMessage(tab.id, message);
}
