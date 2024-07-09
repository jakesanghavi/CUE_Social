const Deck = require('../models/deck_model.js');
const sharp = require('sharp');

// GET decks for user with pagination
const getDecksForUser = async (request, response) => {
    const { id } = request.params // Assuming you have user information in req.user
    const page = parseInt(request.query.page) || 1; // Page number from query parameter
    const limit = 10; // Number of decks per page
    console.log(id)

    try {
        const skips = (page - 1) * limit;
        const decks = await Deck.find({ user: id }).skip(skips).limit(limit);
        response.status(200).json(decks);
    } catch (error) {
        console.error('Error fetching decks:', error);
        response.status(500).json({ message: 'Server error' });
    }
};

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

module.exports = { getDecksForUser, postDeck };
