import express from 'express';
import * as faissService from './services/faissServices.js';
import * as encoderService from './services/encoderService.js';
import { appendToJSONFile, readJSONFile } from './services/unencodedService.js';

const app = express();
app.use(express.json());

export const loadServices = async () => {
    try {
        await encoderService.loadModel();
        await faissService.loadIndex();
        console.log("Model and index loaded successfully");

        app.listen(3000, () => {
            console.log("Server running on http://localhost:3000");
        });
    } catch (error) {
        console.error("Error loading model or index:", error);
    }
};

app.post('/ingest', async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) {
            return res.status(400).send("No 'data' field provided in the request body");
        }
        const embedding = await encoderService.createEmbeddingArray([data]);
        if (!embedding || embedding.length === 0) {
            return res.status(400).send("Can't make an embedding for size 0");
        }
        await faissService.addToIndex(embedding[0]);
        await faissService.saveIndex();
        appendToJSONFile(data);
        res.status(200).send("Ingested successfully");
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send("Error ingesting text");
    }
});

app.get("/query", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).send("No 'query' parameter provided");
        }
        const queryEmbedding = await encoderService.createEmbeddingArray([query]);
        if (!queryEmbedding || queryEmbedding.length === 0) {
            return res.status(400).send("Can't create an embedding for the query text");
        }
        const searchResults = await faissService.searchInIndex(queryEmbedding[0]);
        const closestMatch = searchResults.labels[0];
        const jsonData = readJSONFile()
        const closestMatchText = jsonData.find(item => item.index === closestMatch)?.result || "No match found";

        res.status(200).json({
            meta: searchResults,
            text: closestMatchText
        });
        console.log("queried succesfully")
    } catch (error) {
        console.error("Error processing query:", error);
        res.status(500).send("Error querying the index");
    }
});

loadServices();

export default app;
