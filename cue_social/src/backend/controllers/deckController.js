const Deck = require('../models/deck_model.js');
const sharp = require('sharp');

// POST a certain deck
const postDeck = async (request, response) => {
    console.log(request.body);

    const { title, album, tags, description, cards, deckcode, user, email } = request.body;
    const file = request.file; // The uploaded file

    if (!email) {
        response.status(400).json({ error: 'Not logged in!' });
        return;
    }

    try {
        // Use sharp to resize the image and reduce its quality
        const resizedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800 }) // Resize the image to a width of 800px (adjust as needed)
            .jpeg({ quality: 50 }) // Convert to JPEG with 50% quality (adjust as needed)
            .toBuffer();

        const deck = await Deck.create({
            title,
            description,
            album,
            tags,
            image: { data: resizedImageBuffer }, // Use resized image buffer
            // image: { data: file.buffer }, // non-compressed image
            cards: JSON.parse(cards), // Parse the cards JSON string
            deckcode,
            user: user
        });

        response.status(200).json(deck);
    } catch (error) {
        console.log(error.message);
        response.status(400).json({ error: error.message });
    }
};

module.exports = { postDeck };
