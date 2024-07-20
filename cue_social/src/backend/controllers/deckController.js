const Deck = require('../models/deck_model.js');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2; // Assuming you have installed 'cloudinary' package
const os = require('os')
const path = require('path');

// GET decks for user with pagination
const getDecksForUser = async (request, response) => {
    const { id } = request.params // Assuming you have user information in req.user
    const page = parseInt(request.query.page) || 1; // Page number from query parameter
    const limit = 16; // Number of decks per page

    try {
        const skips = (page - 1) * limit;
        const decks = await Deck.find({ user: id }).skip(skips).limit(limit);
        response.status(200).json(decks);
    } catch (error) {
        console.error('Error fetching decks:', error);
        response.status(500).json({ message: 'Server error' });
    }
};

// GET decks from homepage query
const getDecksBySearch = async (request, response) => {
    const { albums, collections, tags, cards, sortBy } = request.body; // Use body to receive search params
    const page = parseInt(request.query.page) || 1; // Page number from query parameter
    const limit = parseInt(request.query.limit) || 12; // Number of decks per page

    try {
        const query = {};

        if (albums && albums.length > 0) {
            query.albums = { $all: albums };
        }

        if (collections && collections.length > 0) {
            query.collections = { $all: collections };
        }

        if (tags && tags.length > 0) {
            query.tags = { $all: tags };
        }

        if (cards && cards.length > 0) {
            query.cards = { $all: cards };
        }

        let sortCriteria = {};
        if (sortBy === 'score') {
            sortCriteria = { createdAt: -1 };
        } else {
            sortCriteria = { score: -1 }; // Assuming 'score' is the field for upvotes
        }

        const skips = (page - 1) * limit;
        const decks = await Deck.find(query).sort(sortCriteria).skip(skips).limit(limit);
        const totalDecks = await Deck.countDocuments(query); // To get the total number of matching decks

        response.status(200).json({ decks, totalDecks });
    } catch (error) {
        console.error('Error fetching decks:', error);
        response.status(500).json({ message: 'Server error' });
    }
};




const getOneDeck = async (request, response) => {
    const { id } = request.params // Assuming you have user information in req.user

    try {
        const decks = await Deck.findOne({ _id: id });
        response.status(200).json(decks);
    } catch (error) {
        console.error('Error fetching decks:', error);
        response.status(500).json({ message: 'Server error' });
    }
};


// POST a certain deck
const postDeck = async (request, response) => {
    const { title, albums, collections, tags, description, cards, deckcode, user, email } = request.body;
    const file = request.file; // The uploaded file
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, file.originalname);

    if (!email) {
        response.status(400).json({ error: 'Not logged in!' });
        return;
    }

    try {
        // Use sharp to resize the image and reduce its quality
        await sharp(file.buffer) // Input image buffer
            .resize({ width: 800 }) // Resize the image to a width of 800px (adjust as needed)
            .jpeg({ quality: 50 }) // Convert to JPEG with 50% quality (adjust as needed)
            .toFile(filePath);

        cloudinary.config({
            cloud_name: 'defal1ruq',
            api_key: process.env.CLOUDINARY_PK,
            api_secret: process.env.CLOUDINARY_SK // Click 'View Credentials' below to copy your API secret
        });

        let imageOutput = null;


        try {
            const result = await cloudinary.uploader.upload(filePath, {
                resource_type: "auto",
            });
            imageOutput = result;
        } catch (error) {
            console.error(error);
        }

        const deck = await Deck.create({
            title,
            description,
            albums: JSON.parse(albums),
            collections: JSON.parse(collections),
            tags: JSON.parse(tags),
            image: imageOutput.url, // Use resized image buffer
            cards: JSON.parse(cards), // Parse the cards JSON string
            deckcode,
            user: user
        });

        response.status(200).json(deck);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

module.exports = { getDecksForUser, getDecksBySearch, postDeck, getOneDeck };
