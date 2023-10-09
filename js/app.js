
const AWS = require('aws-sdk');
const express = require('express');
const cors = require('cors');
const corsOptions = {
    origin: 'http://your-extension-id/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

const app = express();
const port = 3000;

// Configure AWS Region (e.g., us-west-2)
AWS.config.update({
    region: 'us-east-2'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Check for duplicate URLs
app.post('/checkDuplicateURL', async (req, res) => {
    const { uniqueURL } = req.body;
    const params = {
        TableName: 'SentimentAnalysisData',
        Key: { 'URL': uniqueURL }
    };

    try {
        const data = await dynamodb.get(params).promise();
        res.json({ isDuplicate: !!data.Item });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Save Hume.ai analysis
app.post('/saveAnalysis', async (req, res) => {
    const { uniqueURL, humeOutput } = req.body;
    const params = {
        TableName: 'SentimentAnalysisData',
        Item: {
            'URL': uniqueURL,
            'HumeOutput': humeOutput
        }
    };

    try {
        await dynamodb.put(params).promise();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
