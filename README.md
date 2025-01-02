# Simple RAG API

## Objective

The **Simple RAG API** is a minimal backend service that stores a set of documents, generates embeddings for these documents, stores them in a vector store, and allows for retrieval of the most relevant documents based on a user query. This project is implemented using Node.js and includes the use of **FAISS** for vector storage and **Sentence Embeddings** for converting text to embeddings. It was created as an assigment for joining an internship.

## Requirements

- **Data Ingestion**: Convert sample text passages into embeddings using an embedding model and store both the raw text and its embedding.
- **Retrieval**: Implement an endpoint to retrieve the most relevant text passages for a given query.
- **API Endpoints**:
  - `POST /ingest`: Ingests new text to be stored in the vector store.
  - `GET /query?query=...`: Retrieves the most relevant ingested text based on the query provided.

## Features

- **POST `/ingest`**: Stores text and its corresponding embedding in the vector store.
- **GET `/query`**: Takes a user query and retrieves the most relevant passages based on the query's embedding.

## Prerequisites

- Node.js (version 14 or above) installed.
- A local or free-tier vector database like FAISS to store embeddings.

## Installation

1. Clone the repository:

    ```bash
    git clone SimpleRAG
    cd SimpleRAG
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the app:

    ```bash
    npm start
    ```

## API Endpoints

### `POST /ingest`

Ingest new text to be stored in the vector store.

- **Request Body**: JSON object with the field `data` containing the text to ingest.
    ```json
    {
        "data": "The Redwood Forest in California is home to some of the tallest trees on Earth."
    }
    ```

- **Response**: 
    - Status: `200 OK`
    - Message: `Ingested successfully`

### `GET /query`

Retrieve the most relevant ingested text based on the provided query.

- **Query Parameters**: `query` (The query text).
  
    Example: `/query?query=Civic`

- **Response**: 
    - Status: `200 OK`
    - Body: the most relevant result based on the query.

    Example:
    ```json
    {
    "meta": {
        "distances": [
            1.5751075744628906
        ],
        "labels": [
            0
        ]
    },
    "text": "Civic is an AI mail assistant that modernizes constituent communications through email, phone, and mail automation, providing advanced analytics to measure engagement."
    }
    ```

## Testing

To run the tests:

1. Ensure the app is running.
2. Run the tests:
    ```bash
    npm test
    ```

## Conclusion

This API is designed to demonstrate a simple implementation of a **Retrieval-Augmented Generation (RAG)** system. The service stores documents, generates embeddings, and allows for retrieval based on user queries.

---

Let me know if you need further adjustments or additions!