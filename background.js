chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendEmails") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: injectEmails,
                    args: [message.emails]
                });
            }
        });
    }
});

function injectEmails(emails) {
    let index = 0;
    console.log(emails);
    
    const cloud = document.getElementsByClassName("zoom-tabs__item");
    // console.log(cloud);
    function sendNextEmail() {
        if (index >= cloud.length) return;
        // const sendButton = document.querySelector("button");
        // if (emailField && sendButton) {
            // emailField.value = emails[index];
            // sendButton.click();
            cloud[index].click();
            index++;
            setTimeout(sendNextEmail, 3000);
        // }
    }
    sendNextEmail();
}