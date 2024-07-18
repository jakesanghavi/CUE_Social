const Deck = require('../models/deck_model.js');
const sharp = require('sharp');
const ImageKit = require("imagekit-javascript")
const { generateAuthenticationParams } = require('./secureUploadController')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

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
    const { albums, collections, tags, cards } = request.body; // Use body to receive search params
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

        const skips = (page - 1) * limit;
        const decks = await Deck.find(query).skip(skips).limit(limit);
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
    const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PK,
        privateKey: process.env.IMAGEKIT_SK,
        urlEndpoint: process.env.IMAGEKIT_URL,
    });

    const authenticationParameters = generateAuthenticationParams();
    const { title, albums, collections, tags, description, cards, deckcode, user, email } = request.body;
    const file = request.file; // The uploaded file

    if (!email) {
        response.status(400).json({ error: 'Not logged in!' });
        return;
    }

    try {
        // Use sharp to resize the image and reduce its quality
        const resizedImage = await sharp(file.buffer)
            .resize({ width: 800 }) // Resize the image to a width of 800px (adjust as needed)
            .jpeg({ quality: 50 }) // Convert to JPEG with 50% quality (adjust as needed)
            .toBuffer().toString('base64');; // Convert to buffer for upload

        // Upload function internally uses the ImageKit.io javascript SDK
        function upload(fileBuffer, fileName) {
            return new Promise((resolve, reject) => {
                imagekit.upload({
                    file: fileBuffer,
                    fileName: fileName,
                    token: authenticationParameters.token,
                    signature: authenticationParameters.signature,
                    expire: authenticationParameters.expire
                }).then(result => {
                    resolve(result); // Resolve with the result from ImageKit upload
                }).catch(error => {
                    reject(error); // Reject with any error from ImageKit upload
                });
            });
        }

        // Upload the resized image to ImageKit
        const imageUploadResult = await upload(resizedImage, file.originalname);
        console.log(imageUploadResult)
        

        // Create a new Deck with the uploaded image URL from ImageKit
        const deck = await Deck.create({
            title,
            description,
            albums: JSON.parse(albums),
            collections: JSON.parse(collections),
            tags: JSON.parse(tags),
            image: imageUploadResult.url, // Store the URL of the uploaded image
            cards: JSON.parse(cards),
            deckcode,
            user: user
        });

        response.status(200).json(deck); // Send the created deck as JSON response
    } catch (error) {
        console.error(error.message);
        response.status(400).json({ error: error.message }); // Handle any errors and send as JSON response
    }
};

module.exports = { getDecksForUser, getDecksBySearch, postDeck, getOneDeck };
