import faiss from 'faiss-node';
import fs from 'fs';

let index = new faiss.IndexFlatL2(512);
const indexFilePath = 'faiss_index.index';


export async function saveIndex() {
    try {
        const indexData = index.toBuffer();

        fs.writeFileSync(indexFilePath, indexData);
        console.log("Faiss index saved successfully.");
    } catch (error) {
        console.error("Error saving Faiss index:", error);
    }
}

export async function loadIndex() {
    try {
        if (fs.existsSync(indexFilePath)) {
            const indexData = fs.readFileSync(indexFilePath);
            index = faiss.Index.fromBuffer(new Uint8Array(indexData));
            console.log("Faiss index loaded successfully.");
        } else {
            console.log("No saved Faiss index found.");
        }
    } catch (error) {
        console.error("Error loading Faiss index:", error);
    }
}


export async function addToIndex(embedding) {
    try {
        index.add(embedding);
        console.log("Added vector to index.");
    } catch (error) {
        console.error("Error adding to Faiss index:", error);
    }
}

export async function searchInIndex(queryEmbedding, k = 1) {
    try {
        const results = index.search(queryEmbedding, k);
        return results;
    } catch (error) {
        console.error("Error searching in Faiss index:", error);
        throw error;
    }
}