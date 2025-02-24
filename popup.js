document.getElementById("sendEmails").addEventListener("click", () => {
    const emails = document.getElementById("emails").value.split(",").map(e => e.trim());
    chrome.storage.local.set({ emails });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: startEmailSending
            });
        }
    });
});

function startEmailSending() {
    chrome.storage.local.get("emails", ({ emails }) => {
        if (emails && emails.length > 0) {
            chrome.runtime.sendMessage({ action: "sendEmails", emails });
        }
    });
}