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

        const worker = await createWorker("eng");

        const ret = await worker.recognize(filePath);
        const text = ret.data.text;
        // console.log(ret.data.hocr)
        // const toReturn = processLines(text)
        // await worker.terminate();

        const wordRegex = /<span class='ocrx_word'[^>]*title='bbox (\d+) (\d+) (\d+) (\d+); x_wconf (\d+)'[^>]*>([^<]+)<\/span>/g;
        let match;
        const words = [];


        while ((match = wordRegex.exec(ret.data.hocr)) !== null) {
            const [_, x1, y1, x2, y2, x_wconf, text] = match;
            if (x_wconf > 30) {
                words.push({
                    text,
                    bbox: {
                        x1: parseInt(x1),
                        y1: parseInt(y1),
                        x2: parseInt(x2),
                        y2: parseInt(y2),
                    },
                    x_wconf: parseInt(x_wconf)
                });
            }
        }

        // console.log(words);

        const threshold = 40; // Adjust this value based on your specific needs

        const groupedWords = [];
        let currentGroup = [];
        let cards = [];
        let deckCode = "";

        for (let i = 0; i < words.length; i++) {
            const currentWord = words[i];
            if (currentGroup.length === 0) {
                currentGroup.push(currentWord);
            } else {
                const lastWord = currentGroup[currentGroup.length - 1];
                const distance = currentWord.bbox.x1 - lastWord.bbox.x2;

                if (distance <= threshold) {
                    currentGroup.push(currentWord);
                } else {
                    groupedWords.push(currentGroup);
                    currentGroup = [currentWord];
                }
            }
        }

        if (currentGroup.length > 0) {
            groupedWords.push(currentGroup);
        }


        const phrases = groupedWords.map(group => group.map(word => word.text).join(' '));
        const acceptChars = ['(', ' ', ')', '{', '}'];

        // console.log("Extracted and separated text:");
        phrases.forEach((line) => {
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
                // let code = codes[codes.length - 1];
                deckCode = code.trim();
                // console.log(deckCode)
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

        const resp = {
            cards: cards,
            deck_code: deckCode
        };

        console.log(resp)

        return response.status(200).json(resp);
    }
    catch (error) {
        console.log(error.message);
        response.status(400).json({ error: error.message });
    }
};

module.exports = { recognizeText }
