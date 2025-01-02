import * as tf from '@tensorflow/tfjs';
import use from '@tensorflow-models/universal-sentence-encoder';

let model;


export async function loadModel() {
    try {
        model = await use.load();
        console.log("Model loaded successfully!");
        return model;
    } catch (error) {
        console.error("Error loading model:", error);
    }
}

export async function createEmbeddingArray(wordArr) {
    try {
        const embeddings = await model.embed(wordArr);
        const embeddingArray = embeddings.arraySync();
        return embeddingArray;
    } catch (error) {
        console.error("Error generating embeddings:", error);
    }
}