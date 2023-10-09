// popup.js
import AWS from '../lib/aws-sdk.js';

document.addEventListener('DOMContentLoaded', function () {
    console.log('Popup script loaded');

    var analyzeButton = document.getElementById('analyze-button');

    analyzeButton.addEventListener('click', function () {
        // Message background script to perform analysis
        console.log('Sending message from popup to background');
        chrome.runtime.sendMessage({ action: 'analyzeText' }, function (response) {
            console.log(response);
            console.log("Received response from background", response);
        });
    });
});

// Function to update the video title in the popup
function updateVideoTitle(title) {
    const videoTitleElement = document.getElementById('video-title');
    if (videoTitleElement) {
        videoTitleElement.textContent = title;
    }
}

// Function to update the video description in the popup
function updateVideoDescription(description) {
    const videoDescriptionElement = document.getElementById('video-description');
    if (videoDescriptionElement) {
        videoDescriptionElement.textContent = description;
    }
}
// Function to truncate text to 50 words
function truncateTo35Words(text) {
    return text.split(' ').slice(0, 50).join(' ');
}

console.log('Popup script loaded');
// Function to update the video URL in the popup
function updateVideoURL(url) {
    const videoURLElement = document.getElementById('video-url');
    if (videoURLElement) {
        videoURLElement.textContent = url;
    }
}

// Get the active tab and execute the script to fetch the title and description
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab.url) {
        if (tab.url === 'https://youtube.com/' || tab.url === 'https://www.youtube.com/') {
            updateVideoTitle('YouTube Main Page');
            updateVideoDescription('N/A');
            updateVideoURL(tab.url);
        } else if (tab.url.startsWith('https://www.youtube.com/')) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    const titleElement = document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata');
                    const title = titleElement ? titleElement.textContent : 'Not Found';
                    const descriptionElement = document.querySelector('div#description.ytd-video-secondary-info-renderer');
                    const description = descriptionElement ? descriptionElement.textContent : 'Description Not Found';
                    return { title, description };
                },
            }, (results) => {
                let { title, description } = results[0].result;

                // Truncate title and description to 35 words each
                title = truncateTo35Words(title);
                description = truncateTo35Words(description);

                updateVideoTitle(title);
                updateVideoDescription(description);
                updateVideoURL(tab.url);

                // Store the truncated data in local storage for later use
                chrome.storage.local.set({ youtubeData: { title, description } });
            });
        } else {
            updateVideoTitle('Not on YouTube');
            updateVideoDescription('Not on YouTube');
            updateVideoURL(tab.url);
        }
    }
});
