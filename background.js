
// Function to refresh the popup
function refreshPopup() {
    chrome.extension.getViews({ type: 'popup' }).forEach((popup) => {
        if (popup.location.href.endsWith('popup.html')) {
            popup.location.reload();
        }
    });
}

// Listen for changes in the active tab
chrome.tabs.onActivated.addListener((activeInfo) => {
    refreshPopup();
});

// Listen for tab updates, including page load completion
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        if (tab.url && tab.url.startsWith('https://www.youtube.com/')) {
            chrome.action.setIcon({ path: 'workinglogo.png', tabId: tab.id }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error setting working logo:', chrome.runtime.lastError);
                }
            });
        } else {
            chrome.action.setIcon({ path: 'noLogo.png', tabId: tab.id }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error setting no logo:', chrome.runtime.lastError);
                }
            });
        }
    }
});
