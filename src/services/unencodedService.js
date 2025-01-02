import fs from 'fs';
const filePath = 'unencodedService.json';


export const appendToJSONFile = (unencodedText) => {
    let currentData = [];
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');

        try {
            currentData = JSON.parse(fileData);
        } catch (error) {
            console.error('Error parsing JSON file:', error);
            return;
        }
    }

    const currentIndex = currentData.length;
    const newData = { index: currentIndex, result: unencodedText };
    currentData.push(newData);

    try {
        fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
};

export const readJSONFile = () => {
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileData);
    } else {
        return [];
    }
}