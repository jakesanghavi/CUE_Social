const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentsSchema = new Schema({
    DeckID: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    Comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model(process.env.COMMENTS_COLLECTION, commentsSchema)