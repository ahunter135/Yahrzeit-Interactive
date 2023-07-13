window.addEventListener("message", function(event) {
    if (event.source != window) return;
    if (!event.data.methodName) return;
    if (event.data.from != 'page-script') return;
    switch (event.data.methodName) {
        case 'startup':
        case 'restartDevice':
        case 'reload':
        case 'log':
            chrome.runtime.sendMessage(event.data, response => {});
        default:
            break;
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        request['from'] = 'content-script';
        window.postMessage(request, '*');
    }
);
