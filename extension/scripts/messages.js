/*  This file contains the functions, scripts, vars, etc. that handle
    requests from the PWA. Each function takes the same parameters as the
    message listener
*/

const restartDevice = async function(request, sender) {
    chrome.runtime.restart();
    return undefined;
}

const startup = async function(request, sender) {
    const deviceData = {
        deviceAssetId: undefined,
        deviceSerialNumber: undefined
    };

    // NOTE: The chrome.enterprise.deviceAttributes only works if two conditions are met:
    // 1. The device is running ChromeOS
    // 2. The extension is pre-installed by policy
    deviceData.deviceAssetId = await chrome.enterprise.deviceAttributes.getDeviceAssetId();
    deviceData.deviceSerialNumber = await chrome.enterprise.deviceAttributes.getDeviceSerialNumber();

    if (!deviceData.deviceAssetId || !deviceData.deviceSerialNumber) {
        return { deviceData: undefined, errorMessage: 'TODO: Handle errors cooler' };
    } else {
        return { deviceData };
    }
}