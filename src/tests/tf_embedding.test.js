require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

beforeAll(async () => {
    console.log("started embedding test");
});

afterAll(async () => { //delete the user table and close at run exit
    console.log("finished embedding test");


});

jest.setTimeout(20000); // 5 seconds is not enough


describe('Embedding Library tests', () => {

    test('Create Embeddings', async () => {
        const model = await use.load();
        const sentences = [ //sentences found on the universal sentence encoder github
            'Hello.',
            'How are you?'
        ];

        const embeddings = await model.embed(sentences);
        const embeddingArray = embeddings.arraySync();
        console.log('Embeddings:', embeddingArray);

        // test cases
        expect(embeddingArray).toBeInstanceOf(Array); // make sure its an array
        expect(embeddingArray.length).toBe(sentences.length); // make sure it encoded correctly by comparing lengths
        embeddingArray.forEach(embedding => { //make sure each embedding is an array > 0
            expect(embedding).toBeInstanceOf(Array);
            expect(embedding.length).toBeGreaterThan(0);
        });
    });
});
