/**
  Developer notes:
    - In production, the manifest needs to have "kiosk_only": true, and the content_script's matches needs to match the PWA url only.
      This ensures only the PWA can send messages to the background script.
*/



/**
 * @description Restarts the device
 * @param {*} request Request passed from the onMessageListener
 * @param {*} sender Sender passed from the onMessageListener
 * @returns Nothing
 */
const restartDevice = async function(request, sender) {
  chrome.runtime.restart();
  return undefined;
}

/**
 * @description Startup function that returns the deviceAssetId and deviceSerialNumber to the message sender
 * @param {*} request Request passed from the onMessageListener
 * @param {*} sender Sender passed from the onMessageListener
 * @returns An object with deviceData and possibly an errorMessage. deviceData contains the deviceAssetId and deviceSerialNumber.
 * They are a string (double check this) or undefined
 */
const startup = async function(request, sender) {
  // Can only run startUp if the extension has the enterprise.deviceAttributes permission
  if (!(await chrome.permissions.contains({ permissions: ['enterprise.deviceAttributes'] }))) {
    throw new Error("The extension does not have the enterprise.deviceAttributes permission");
  }

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
      return { deviceData: undefined, errorMessage: 'deviceAssetId and/or deviceSerialNumber not found through chrome API' };
  } else {
      return { deviceData };
  }
}

// Just using this to test the messaging system
const log = async function(request, sender) {
  console.log(request.message);
  return request.message;
}

chrome.runtime.onMessage.addListener(
  /**
    @summary Function responsible for listening to messages from the PWA.
    @callback sendResponse Callback with a single parameter. A response object or undefined
  */
  async function(request, sender, sendResponse) {
    let res = undefined;

    if (request.methodName === 'startup') {
      res = await startup(request, sender);
    } else if (request.methodName === 'restartDevice') {
      res = await restartDevice(request, sender);
    } else if (request.methodName === 'log') {
      res = await log(request, sender);
    }
    sendResponse(res);
  }
);