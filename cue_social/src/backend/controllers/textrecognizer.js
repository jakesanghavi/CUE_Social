const { createWorker } = require('tesseract.js');
const sharp = require('sharp');
const path = require('path')

const recognizeText = async (request, response) => {
    const acceptChars = ['(', ' ', ')', '{', '}'];

    const processLines = (lineString) => {
        const cards = [];

        const lines = lineString.split('\n');

        lines.forEach(line => {
            if (line.includes("DECK CODE:")) {
                const codes = line.split(":");
                const code = codes[codes.length - 1];
                const deckCode = code.trim();
            }

            line = line.split(' ');
            let i = 0;
            let flag = false;

            while (!flag && i < line.length) {
                if (line[i] === line[i].toUpperCase()) {
                    flag = true;
                } else {
                    i += 1;
                }
            }

            line = line.slice(i);
            line = line.join(' ');

            let indexOfFirstCapital = null;

            for (let index = 0; index < line.length; index++) {
                const char = line[index];
                if (char === char.toUpperCase()) {
                    indexOfFirstCapital = index;
                    break;
                }
            }

            let leadingLine = [];
            if (indexOfFirstCapital !== null) {
                leadingLine = line.slice(indexOfFirstCapital);
            }

            let trailingLine = [];
            let foundLower = false;
            for (const char of leadingLine) {
                if (char.toLowerCase() === char || (acceptChars.indexOf(char) === -1 && char === char.toLowerCase())) {
                    foundLower = true;
                    break;
                }
                if (!foundLower) {
                    trailingLine.push(char);
                }
            }

            trailingLine = trailingLine.join('');

            const capitalLetters = trailingLine.split('').filter(char => char === char.toUpperCase() || acceptChars.includes(char)).join('').trim();

            // Remove single-character words unless they are 'A' or 'I'
            const processedLineWords = [];
            capitalLetters.split(' ').forEach(word => {
                if (word.length > 1 || word === 'A' || word === 'I') {
                    processedLineWords.push(word);
                }
            });

            const processedLine = processedLineWords.join(' ').trim();
            if (processedLine.length > 0) {
                cards.push(processedLine);
            }
        });

        return cards;
    };

    try {
        const file = request.file

        const uploadDir = path.join(__dirname, '../../assets'); // Directory path relative to backend/controllers
        const filePath = path.join(uploadDir, file.originalname);

        await sharp(file.buffer).toFile(filePath);

        console.log('helo')

        const worker = await createWorker("eng");

        const ret = await worker.recognize(filePath);
        const text = ret.data.text;
        const toReturn = processLines(text)
        console.log(toReturn)
        await worker.terminate();
        return text;
    }
    catch (error) {
        console.log(error)
    }
};

module.exports = { recognizeText }
