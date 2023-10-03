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

// Function to update the video URL in the popup
function updateVideoURL(url) {
    const videoURLElement = document.getElementById('video-url');
    if (videoURLElement) {
        videoURLElement.textContent = url;
    }
}

// Function to truncate text to a specified number of words
function truncateText(text, maxWords) {
    const words = text.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
}

// Function to handle errors and display a message
function handleScriptError(error) {
    console.error('Error executing script:', error);
    updateVideoTitle('Error fetching data');
    updateVideoDescription('Error fetching data');
    updateVideoURL('Error fetching data');
}

// Get the active tab and execute the script to fetch the title and description
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab.url) {
        if (tab.url === 'https://youtube.com/' || tab.url === 'https://www.youtube.com/') {
            // Special case for YouTube main page
            updateVideoTitle('YouTube Main Page');
            updateVideoDescription('N/A');
            updateVideoURL(tab.url);
        } else if (tab.url.startsWith('https://www.youtube.com/')) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    const titleElement = document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata');
                    const title = titleElement ? titleElement.textContent : 'Not Found';

                    // Fetch the description content
                    const descriptionElement = document.querySelector('div#description.ytd-video-secondary-info-renderer');
                    const description = descriptionElement ? descriptionElement.textContent : 'Description Not Found';

                    return { title, description }; // Return both title and description
                },
            }, (results) => {
                const { title, description } = results[0].result; // Access the results and destructuring
                console.log('Script Result - Title:', title); // Add this line for debugging
                console.log('Script Result - Description:', description); // Add this line for debugging

                updateVideoTitle(truncateText(title, 35)); // Truncate title to 35 words
                updateVideoDescription(truncateText(description, 35)); // Truncate description to 35 words
                updateVideoURL(tab.url);
            });
        } else {
            // For URLs other than YouTube or YouTube video pages
            updateVideoTitle('Not on YouTube');
            updateVideoDescription('Not on YouTube');
            updateVideoURL(tab.url);
        }
    }
});
