const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deckSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    albums: {
        type: [String],
        required: true
    },
    collections: {
        type: [String],
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    cards: {
        type: [String],
        required: true
    },
    deckcode: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model(process.env.DECK_COLLECTION, deckSchema);
