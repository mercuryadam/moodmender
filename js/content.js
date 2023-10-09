let titleElement = document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata');
let snippetElement = document.querySelector('#description');

let data = {
    title: titleElement ? titleElement.textContent : "Not Found",
    description: snippetElement ? snippetElement.textContent : "Not Found"
};

chrome.storage.local.set({ 'youtubeData': data });
