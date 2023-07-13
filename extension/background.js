/**
    * @description Startup function that returns the deviceAssetId and deviceSerialNumber to the message sender
    * @param {*} request Request passed from the onMessageListener
    * @param {*} sender Sender passed from the onMessageListener
    * @returns An object with deviceData and possibly an error. deviceData contains the deviceAssetId and deviceSerialNumber.
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
        sendMessageToPWA({ methodName: 'deviceAssetIdCallback', assetId: undefined, error: err.message });
    }
}

const getSerialNumber = async function(request, sender) {
    try {
        chrome.enterprise.deviceAttributes.getDeviceSerialNumber(deviceSerialNumberCallback);
    } catch (err) {
        sendMessageToPWA({ methodName: 'deviceSerialNumberCallback', serialNumber: undefined, error: err.message });
    }
}

const deviceAssetIdCallback = async function(assetIdString) {
    sendMessageToPWA({ methodName: 'deviceAssetIdCallback', assetId: assetIdString });
}

const deviceSerialNumberCallback = async function(serialNumberString) {
    sendMessageToPWA({ methodName: 'deviceSerialNumberCallback', serialNumber: serialNumberString });
}

const restartDevice = async function(request, sender) {
    try {
        chrome.runtime.restart();
    } catch (err) {
        sendMessageToPWA({ methodName: 'restartCallback', error: err });
    }
}

chrome.runtime.onMessage.addListener(
    /**
    @summary Function responsible for listening to messages from the PWA.
    @callback sendResponse Callback with a single parameter. A response object or undefined
    */
    async function(request, sender, sendResponse) {
        if (request.methodName === 'startup') {
            startup(request, sender);
        } else if (request.methodName === 'restartDevice') {
            restartDevice(request, sender);
        } else if (request.methodName === 'log') {
            console.log(request.message);
            sendMessageToPWA({ methodName: 'logCallback', message: request.message });
        } else if (request.methodName === 'reload') {
            try { chrome.runtime.reload(); }
            catch (err) { console.log(`Reload error: ${err}`); }
        }
        sendResponse({});
    }
);

const sendMessageToPWA = async function(message) {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = chrome.tabs.sendMessage(tab.id, message);
}
