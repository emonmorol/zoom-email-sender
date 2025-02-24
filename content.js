chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendEmails") {
        injectEmails(message.emails);
    }
});
