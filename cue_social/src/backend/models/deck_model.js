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
        data: Buffer, // Store image as Buffer data
        contentType: String // Mime type of the image
    }
});

const Upload = mongoose.model(process.env.DECK_COLLECTION, deckSchema);

module.exports = Upload;
