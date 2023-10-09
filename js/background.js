console.log('Background script loaded Hume Web Socket js');

// Function to analyze text using Hume
function analyzeTextWithHume(title, description) {
    // Your logic to connect to Hume WebSocket
    const ws = connectToHumeWebSocket();

    ws.addEventListener('open', () => {
        console.log('WebSocket connection opened.');

        const message = JSON.stringify({
            models: {
                language: {}
            },
            raw_text: true,
            data: `${title} ${description}`
        });

        ws.send(message);
    });

    ws.addEventListener('message', async (event) => {
        const response = JSON.parse(event.data);
        console.log('Received data from Hume:', response);
    });

    ws.addEventListener('error', (error) => {
        console.error('WebSocket Error:', error);
    });

    ws.addEventListener('close', () => {
        console.log('WebSocket connection closed.');
    });
}

// Function to refresh the popup
function refreshPopup() {
    console.log('Refreshing popup');
    chrome.windows.getAll({ populate: true }, (windows) => {
        windows.forEach((window) => {
            window.tabs.forEach((tab) => {
                if (tab.url && tab.url.endsWith('popup.html')) {
                    chrome.tabs.reload(tab.id);
                }
            });
        });
    });
}

function writeToDynamoDB(url, sentimentScore, otherCommonAttributes, userId, userHappinessScore) {
    const params = {
        TableName: 'SentimentAnalysisData',
        Item: {
            'URL': url,
            'SentimentScore': sentimentScore,
            'OtherCommonAttributes': otherCommonAttributes,
            'UserHappinessScores': {
                [userId]: userHappinessScore
            }
        }
    };

    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error('Unable to add item:', JSON.stringify(err, null, 2));
        } else {
            console.log('Added item:', JSON.stringify(data, null, 2));
        }
    });
}

function readFromDynamoDB(url) {
    const params = {
        TableName: 'SentimentAnalysisData',
        Key: { 'URL': url }
    };

    dynamodb.get(params, (err, data) => {
        if (err) {
            console.error('Unable to read item:', JSON.stringify(err, null, 2));
        } else {
            console.log('Get succeeded:', JSON.stringify(data, null, 2));
        }
    });
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        if (tab.url && tab.url.startsWith('https://www.youtube.com/')) {
            chrome.action.setIcon({ path: '../assets/images/workinglogo.png', tabId: tab.id });
        } else {
            chrome.action.setIcon({ path: '../assets/images/noLogo.png', tabId: tab.id });
        }
    }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'updateData') {
        console.log('Message received in background script');
        chrome.storage.local.set({ 'youtubeData': message.data });
    }
});

}).catch ((error) => {
    console.error('Failed to load AWS SDK:', error);
});
