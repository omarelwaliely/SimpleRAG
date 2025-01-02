import request from 'supertest';
import app from '../index';
import * as faissService from '../services/faissServices.js';
import * as encoderService from '../services/encoderService.js';
import { appendToJSONFile, readJSONFile } from '../services/unencodedService.js';


jest.mock('../services/faissServices.js');
jest.mock('../services/encoderService.js');
jest.mock('../services/unencodedService.js');



describe('POST /ingest', () => {
    it('should return 200 when data is ingested successfully', async () => {
        const mockData = 'Some text data';
        encoderService.createEmbeddingArray.mockResolvedValueOnce([['embedding']]);
        faissService.addToIndex.mockResolvedValueOnce();
        faissService.saveIndex.mockResolvedValueOnce();
        appendToJSONFile.mockResolvedValueOnce();

        const response = await request(app)
            .post('/ingest')
            .send({ data: mockData });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Ingested successfully');
    });

    it('should return 400 if no data field is provided', async () => {
        const response = await request(app)
            .post('/ingest')
            .send({});

        expect(response.status).toBe(400);
        expect(response.text).toBe("No 'data' field provided in the request body");
    });

    it('should return 400 if embedding creation fails', async () => {
        const mockData = 'Some text data';
        encoderService.createEmbeddingArray.mockResolvedValueOnce([]);

        const response = await request(app)
            .post('/ingest')
            .send({ data: mockData });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Can't make an embedding for size 0");
    });

    it('should return 500 if there is an error during ingestion', async () => {
        const mockData = 'Some text data';
        encoderService.createEmbeddingArray.mockRejectedValueOnce(new Error('Service error'));

        const response = await request(app)
            .post('/ingest')
            .send({ data: mockData });

        expect(response.status).toBe(500);
        expect(response.text).toBe("Error ingesting text");
    });
});

describe('GET /query', () => {
    it('should return 200 with query results', async () => {
        const mockQuery = 'Civic';
        const mockSearchResults = {
            labels: [0]
        };
        const mockJsonData = [{ index: 0, result: 'Some result' }];
        encoderService.createEmbeddingArray.mockResolvedValueOnce([['queryEmbedding']]);
        faissService.searchInIndex.mockResolvedValueOnce(mockSearchResults);
        readJSONFile.mockReturnValueOnce(mockJsonData);

        const response = await request(app)
            .get('/query')
            .query({ query: mockQuery });

        expect(response.status).toBe(200);
        expect(response.body.text).toBe('Some result');
        expect(response.body.meta).toEqual(mockSearchResults);
    });

    it('should return 400 if no query parameter is provided', async () => {
        const response = await request(app)
            .get('/query');

        expect(response.status).toBe(400);
        expect(response.text).toBe("No 'query' parameter provided");
    });

    it('should return 400 if embedding creation for query fails', async () => {
        const mockQuery = 'Civic';
        encoderService.createEmbeddingArray.mockResolvedValueOnce([]);

        const response = await request(app)
            .get('/query')
            .query({ query: mockQuery });

        expect(response.status).toBe(400);
        expect(response.text).toBe("Can't create an embedding for the query text");
    });

    it('should return 500 if there is an error during query processing', async () => {
        const mockQuery = 'Civic';
        encoderService.createEmbeddingArray.mockRejectedValueOnce(new Error('Service error'));

        const response = await request(app)
            .get('/query')
            .query({ query: mockQuery });

        expect(response.status).toBe(500);
        expect(response.text).toBe("Error querying the index");
    });
});
