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
    album: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    image: {
        data: {
            type: Buffer,
            required: true
        }
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
