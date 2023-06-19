/* Can maybe use some of this later, but I'm going to start from scratch right now


const PWA_ORIGIN = 'https://www.yahrzeitinteractive.com/yahrzeit'//
const PWA_PATH = '/yahrzeit.php?aid='

const createUrl = assetId => {
  const url = `${PWA_ORIGIN}${PWA_PATH}${assetId}`
  chrome.storage.sync.set({ url, assetId })
  return url
}

const destroyTabs = async url => {
  const tabs = await chrome.tabs.query({ currentWindow: true })//.then(res => console.log({ res })) // TODO - close non-assetId tabs
  const leaveOpen = tabs.find(tab => {
    return url === tab.url
  }) || tabs.find(({ url }) => {
    const { origin } = new URL(url)
    return origin === PWA_ORIGIN
  })
  console.log({ tabs })
  chrome.tabs.remove(tabs.map(({ id }) => id).filter(id => id !== leaveOpen.id))
  // tabs.forEach(tab => {
  //   try {
  //     if (tab.id !== leaveOpen.id) {
  //       console.log('closing tab?')
  //       chrome.tabs.discard(tab.id)
  //     }
  //   } catch (e) {
  //     console.log('can not close tab')
  //   }
  // })
}

const redirect = async () => {
  (chrome.enterprise || {
    deviceAttributes: {
      getDeviceAssetId: async callback => await callback()
    }
  }).deviceAttributes.getDeviceAssetId(async (assetId = 0) => {

      // chrome.storage.local.set({}) //set to this if sync causes issues
      const url = createUrl(assetId)
      chrome.tabs.create({ url })
      await destroyTabs(url)

  })
}

chrome.runtime.onInstalled.addListener(redirect);

chrome.runtime.onStartup.addListener(redirect)

chrome.tabs.onCreated.addListener(async tab => {
  const { url } = await chrome.storage.sync.get(['url'])
  // chrome.tabs.create(({ url }))
  await destroyTabs(url)
  //await destroyTabs(url)
})
*/

// I don't think I need this
/*const messageSrc = chrome.runtime.getURL("./scripts/messages.js");

function importStuff() {
  return importScripts(messageSrc);
};

let { restartDevice, startup } = importStuff();*/

chrome.runtime.onMessageExternal.addListener(
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
    }
    sendResponse(res);
  }
);

startup(undefined, undefined).then(res => console.log({ res }))