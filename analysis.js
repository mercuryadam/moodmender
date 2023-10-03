const apiKey = "GFvkhXSYpuSOAIfxCkel8jQpSBe5bp1McgdM0KtyJ2R7eoqa"; // Replace with your Hume.ai API key
const socket = new WebSocket(`wss://api.hume.ai/v0/stream/models?apiKey=${apiKey}`);

// Handle WebSocket events
socket.onopen = () => {
    // The connection is open and ready for communication
    console.log("WebSocket connection is open.");
};

socket.onerror = (error) => {
    // Handle WebSocket errors
    console.error("WebSocket Error:", error);
};

socket.onclose = (event) => {
    // Handle WebSocket closure (e.g., when you want to close it)
    if (event.code === 1000) {
        console.log("WebSocket Closed Gracefully");
    } else {
        console.error("WebSocket Closed with Error:", event.reason);
    }
};

// Handle incoming messages (when you receive data from Hume.ai)
socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log("Received WebSocket Message:", response);
    // Process the received data here (e.g., sentiment analysis results)
};
