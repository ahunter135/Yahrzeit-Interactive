// Imports
import { runAtSpecificTimeOfDay } from './js/schedule'

/*  This id can be found on the chrome://extensions page, shown when you install your Chrome extension,
    or from the Chrome Web Store after the extension has been uploaded.
    This allows your web app to specify the exact extension that they wish to communicate with.
*/
const STATIC_EXTENSION_ID = '';

let deviceAssetId = undefined;
let deviceSerialNumber = undefined;

/** 
    @summary
    This function is used for sending a simple message to the extension with the specified id.
    The extension can process the message and perform some action like restarting or getting the
    device id.
    @param {string} methodName The name of the method the extension should call
    @param {function} callback The callback function
    
    Notes from docs so i don't have to look again:
    -In extension
    chrome.runtime.onMessageExternal.addListener(
        function(request, sender, sendResponse) { send response is a callback
*/
const callExtensionAPI = async function(methodName, callback) {
    chrome.runtime.sendMessage(
        STATIC_EXTENSION_ID,
        {
            methodName
        },
        // Callback function called from extension
        callback
        );
};

// May need this for more complex communication
// Start a long-running conversation:
// var port = chrome.runtime.connect(laserExtensionId);
// port.postMessage(...);

// Runs on startup
chrome.runtime.onStartup.addListener(
    () => {
        // Need to get deviceAssetId , deviceSerialNumber, and possibly other stuff in the future
        // calls an extension function called 'startup' which returns an object 'deviceData' containing
        // the deviceAssetId and deviceSerialNumber
        callExtensionAPI('startup', (response) => {
            if (response && response.deviceData) {
                deviceAssetId = response.deviceData.deviceAssetId;
                deviceSerialNumber = response.deviceData.deviceSerialNumber;
            }
        });
        runAtSpecificTimeOfDay(4, 0, () => {
            callExtensionAPI('restartDevice', (response) => {

            })
        });
    }
)
