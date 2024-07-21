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
    const { albums, collections, tags, cards, sortBy, restricted } = request.body; // Use body to receive search params
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

        if (restricted) {
            // Calculate the date for the most recent Monday at 12:00 AM GMT
            const now = new Date();
            const dayOfWeek = now.getUTCDay(); // Get day of week (0=Sunday, 1=Monday, etc.)
            const daysSinceMonday = (dayOfWeek + 6) % 7; // Number of days since most recent Monday
            const recentMonday = new Date(now);
            recentMonday.setUTCDate(now.getUTCDate() - daysSinceMonday);
            recentMonday.setUTCHours(0, 0, 0, 0); // Set time to 12:00 AM GMT

            // Add date filter to the query
            query.createdAt = { $gte: recentMonday.toISOString() };
        }

        let sortCriteria = {};
        if (sortBy === 'score' || (sortBy && sortBy.value === 'score')) {
            sortCriteria = { score: -1 };
        } else {
            sortCriteria = { createdAt: -1 }; // Assuming 'score' is the field for upvotes
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

const patchUpvotes = async (request, response) => {
    const { id } = request.params
    const { voters, change } = request.body // Assuming you have user information in req.user

    try {
        // Find and update the deck by ID
        const updatedDeck = await Deck.updateOne(
            { _id: id }, // Filter query to match the document
            {
                $set: { voters: voters }, // Update voters
                $inc: { score: change === 'increase' ? 1 : change === 'decrease' ? -1 : 0 } // Increment or decrement upvotes
            },
            { runValidators: true } // Run validators if defined in the schema
        );

        if (!updatedDeck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        // Respond with the updated deck
        response.status(200).json(updatedDeck);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server error' });
    }
};

const deleteOneDeck = async (request, response) => {
    const { id } = request.params; // Assuming you have user information in req.user

    try {
        const result = await Deck.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            response.status(200).json({ message: 'Deck successfully deleted' });
        } else {
            response.status(404).json({ message: 'Deck not found' });
        }
    } catch (error) {
        console.error('Error deleting deck:', error);
        response.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDecksForUser, getDecksBySearch, postDeck, getOneDeck, patchUpvotes, deleteOneDeck };
