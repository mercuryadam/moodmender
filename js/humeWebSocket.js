// Import your API key from the config.js file
import { config } from '../lib/config.js';

const apiKey = config.api_key;


// Function to analyze text with Hume
async function analyzeTextWithHume(title, description, uniqueURL) {
    try {
        // Define the WebSocket URL
        const wsUrl = `wss://api.hume.ai/v0/stream/models?apiKey=${api_key}`;

        // Create a WebSocket connection
        const ws = new WebSocket(wsUrl);

        // WebSocket onopen event
        ws.addEventListener('open', () => {
            console.log('WebSocket connection opened.');

            // Prepare the JSON message to send
            const message = JSON.stringify({
                models: {
                    language: {}
                },
                raw_text: true,
                data: `${title} ${description}`
            });

            // Send the JSON message
            ws.send(message);
        });

        // WebSocket onmessage event
        ws.addEventListener('message', async (event) => {
            const response = JSON.parse(event.data);
            console.log('Received data:', response);
        });

        // WebSocket onerror event
        ws.addEventListener('error', (error) => {
            console.error('WebSocket Error:', error);
        });

        // WebSocket onclose event
        ws.addEventListener('close', () => {
            console.log('WebSocket connection closed.');
        });
    } catch (error) {
        console.error('Error analyzing text with Hume:', error);
    }
}

// Export the analyzeTextWithHume function
export { analyzeTextWithHume };
