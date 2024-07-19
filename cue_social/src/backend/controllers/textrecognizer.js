const sharp = require('sharp');
const path = require('path')
const os = require('os')
const { ocrSpace } = require('ocr-space-api-wrapper');

const recognizeText = async (request, response) => {
    const acceptChars = ['(', ' ', ')', '{', '}'];
    const file = request.file;
    let deckCode = "";

    const compressedImage = await sharp(file.buffer) // Input image buffer
        .resize({ width: 1000 }) // Resize the image to a width of 800px (adjust as needed)
        .webp({ quality: 100 })
        .toBuffer() // Convert to JPEG with 50% quality (adjust as needed)

    const sizeInBytes = compressedImage.length;
    console.log(`Size: ${sizeInBytes} bytes`);

    const base64Image = compressedImage.toString('base64');

    try {
        const res3 = await ocrSpace(`data:image/webp;base64,${base64Image}`, { apiKey: process.env.OCR_KEY });
        const cardsReturned = res3.ParsedResults[0].ParsedText
        const linesArray = cardsReturned.split(/\r?\n/);

        const processLines = (lines) => {
            const cards = [];

            lines.forEach((line) => {
                // console.log(`Line: ${line}`);

                if (line.includes("DECK CODE:")) {
                    let codes = line.split(":");
                    let oneCode = codes[codes.length - 1].split(' ')
                    let code = null
                    for (let k = 0; k < oneCode.length; k++) {
                        if (oneCode[k].length === 6) {
                            code = oneCode[k]
                        }
                    }
                    deckCode = code.trim();
                }

                line = line.split(' ');
                let i = 0;
                let flag = false;

                while (!flag && i < line.length) {
                    if (line[i].toUpperCase() === line[i]) {
                        flag = true;
                    } else {
                        i++;
                    }
                }

                line = line.slice(i).join(' ');

                let indexOfFirstCapital = null;
                for (let index = 0; index < line.length; index++) {
                    const char = line[index];
                    // Check if the character is an uppercase letter or a quote
                    if ((char >= 'A' && char <= 'Z') || char === '"' || char === "'") {
                        indexOfFirstCapital = index;
                        break;
                    }
                }

                let leadingLine = [];
                if (indexOfFirstCapital !== null) {
                    leadingLine = line.slice(indexOfFirstCapital);
                }

                // console.log(leadingLine)

                let trailingLine = [];
                let foundLower = false;
                for (let char of leadingLine) {
                    if (char >= 'a' && char <= 'z' || (!acceptChars.includes(char) && !(char >= 'A' && char <= 'Z'))) {
                        foundLower = true;
                        break;
                    }
                    if (!foundLower) {
                        trailingLine.push(char);
                    }
                }

                trailingLine = trailingLine.join('');
                // console.log(`Trailing Line: ${trailingLine}`);

                let capitalLetters = [...trailingLine].filter(char => char.toUpperCase() === char || acceptChars.includes(char)).join('').trim();
                // console.log(`Capital Letters: ${capitalLetters}`);

                let processedLineWords = [];
                capitalLetters.split(' ').forEach((word) => {
                    if (word.length > 1 || ['A', 'I'].includes(word)) {
                        processedLineWords.push(word);
                    }
                });

                let processedLine = processedLineWords.join(' ').trim();
                if (processedLine.length > 0) {
                    cards.push(processedLine);
                }
                // console.log(`Processed Letters: ${processedLine}`);
            });
            return cards;
        };

        const toReturn = processLines(linesArray);

        const resp = {
            cards: toReturn,
            deck_code: deckCode
        };
    
        return response.status(200).json(resp);
    }
    catch (error) {
        console.log(error.message);
        response.status(400).json({ error: error.message });
    }
};

module.exports = { recognizeText }
