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
    let i = 0;

    function sendNextEmail() {
        if (i >= emails.length) {
            console.log("✅ All emails have been processed.");
            return;
        }

        const emailInput = document.querySelector('input[placeholder="Enter a name or email address"]');
        const sendButton = [...document.querySelectorAll("button")].find(btn => btn.innerText.trim() === "Send");

        if (!emailInput || !sendButton) {
            console.log("❌ Email input field or Send button not found!");
            return;
        }

        emailInput.value = emails[i];
        emailInput.dispatchEvent(new Event("input", { bubbles: true })); 

        
        const checkEmailSuggestion = setInterval(() => {
            const box = document.getElementsByClassName("zoom-checkbox__original");
            const checkbox = box[box.length - 1];
            
            if (checkbox) {
                clearInterval(checkEmailSuggestion);
                checkbox.click(); 

                
                const checkButtonEnabled = setInterval(() => {
                    if (!sendButton.disabled) {
                        clearInterval(checkButtonEnabled);
                        sendButton.click();
                        console.log(`📧 Sent to: ${emails[i]}`);
                        
                        i++;
                        setTimeout(sendNextEmail, 2000); 
                    }
                }, 1000); 
            }
        }, 1000); 
    }

    sendNextEmail();
}
