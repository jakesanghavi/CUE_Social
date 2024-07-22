const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deckSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    albums: {
        type: [String],
        required: false,
        default: []
    },
    collections: {
        type: [String],
        required: false,
        default: []
    },
    tags: {
        type: [String],
        required: false,
        default: []
    },
    image: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    cards: {
        type: [String],
        required: true
    },
    deckcode: {
        type: String,
        required: false,
        default: ''
    },
    user: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    voters: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model(process.env.DECK_COLLECTION, deckSchema);
