// saveToMongo.js

// Function to save YouTube video data to MongoDB
async function saveToMongo() {
    const urlElement = document.getElementById('video-url');
    const titleElement = document.getElementById('video-title');
    const descriptionElement = document.getElementById('video-description');

    const url = urlElement ? urlElement.textContent : '';
    const title = titleElement ? titleElement.textContent : '';
    const description = descriptionElement ? descriptionElement.textContent : '';

    if (url && title && description) {
        const isDuplicate = await checkForDuplicate(url);

        if (!isDuplicate) {
            insertData(url, title, description);
            alert('Video data saved to MongoDB.');
        } else {
            alert('This video already exists in the database.');
        }
    } else {
        alert('Missing video data.');
    }
}

// Function to check for duplicates in MongoDB
async function checkForDuplicate(url) {
    const response = await fetch(`YOUR_BACKEND_API/check-duplicate?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.isDuplicate;
}

// Function to insert data into MongoDB
async function insertData(url, title, description) {
    const response = await fetch(`YOUR_BACKEND_API/insert-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, title, description }),
    });
}

// Add a click event listener to your button
document.getElementById('save-button').addEventListener('click', saveToMongo);
