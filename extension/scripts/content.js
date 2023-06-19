// This file can be used to test the extension. It should act like some script from the PWA.
// NOTE: In the manifest, need to set the matches for content scripts to the PWA url only
setInterval(() => {
    chrome.runtime.sendMessage({ methodName: 'log' }, response => { console.log(response) });
  }, 2000);