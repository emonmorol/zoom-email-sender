document.getElementById("sendEmails").addEventListener("click", () => {
    console.log(document.getElementById("emails").value);
    
    const emails = extractEmails(document.getElementById("emails").value);
    console.log("Emails to send: ", emails);

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

function extractEmails(emailString) {
    return emailString
        .replace(/\n/g, " ") // Replace new lines with spaces
        .split(/,\s*/) // Split by commas and optional spaces
        .map(email => email.match(/(?:[^<]*<([^>]+)>|([^",\s]+@[^",\s]+))/)) // Extract emails
        .filter(match => match) // Remove null results
        .map(match => match[1] || match[2]); // Get email from capture groups
}