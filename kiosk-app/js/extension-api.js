// File that will act as the API for accessing the extension's functionality
let deviceData = { deviceAssetId: undefined, deviceSerialNumber: undefined };
let deviceDataCallback = undefined;

/*
 * @summary Function responsible for sending a message to the PWA to grab deviceAssetId and deviceSerialNumber
 * @param {function} callbackFunction Callback function to be called when the deviceAssetId and deviceSerialNumber are retrieved
 * Takes two parameters: An object with the following properties: deviceAssetId and deviceSerialNumber and an error (undefined if no error)
*/
async function getDeviceData(callbackFunction) {
    deviceDataCallback = callbackFunction;
    messageExtension({ methodName: 'startup' });
}

async function restart() {
    messageExtension({ methodName: 'restartDevice' });
    messageExtension({ methodName: 'reload' }); // probably won't work (docs say it does not work in kiosk mode)
}

// Just using to test communication to the extension
async function log(message) {
    messageExtension({ methodName: 'log', message: message });
}

async function messageExtension(message) {
    message['from'] = 'page-script';
    window.postMessage(message, '*');
}

window.addEventListener("message", function(event) {
    if (event.source != window) return;
    if (!event.data.methodName) return;
    if (event.data.from != 'content-script') return;

    switch (event.data.methodName) {
        case 'deviceAssetIdCallback':
            handleDeviceAssetIdCallback(event.data);
            break;
        case 'deviceSerialNumberCallback':
            handleDeviceSerialNumberCallback(event.data);
            break;
        case 'logCallback':
            console.log(`Log request: ${event.data}`);
            break;
        case 'restartCallback':
            // only called if chrome.runtime.restart() throws an error
            console.log(`Restart request error: ${event.data.error}`);
            break;
        default:
            break;
    }
});

async function handleDeviceAssetIdCallback(request) {
    if (request.error) {
        deviceDataCallback(undefined, request.error);
        return;
    }
    deviceData.deviceAssetId = request.assetId;
    if (deviceData.deviceSerialNumber &&
        deviceData.deviceAssetId) deviceDataCallback(deviceData, undefined);
}

async function handleDeviceSerialNumberCallback(request) {
    if (request.error) {
        deviceDataCallback(undefined, request.error);
        return;
    }
    deviceData.deviceSerialNumber = request.serialNumber;
    if (deviceData.deviceAssetId &&
        deviceData.deviceSerialNumber) deviceDataCallback(deviceData, undefined);
}
