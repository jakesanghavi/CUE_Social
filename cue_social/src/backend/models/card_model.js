const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cardSchema = new Schema({
   Code: {
      type: String,
      required: true
   },
   Name: {
      type: String,
      required: true
   },
   Rarity: {
      type: String,
      required: true
   },
   Type: {
      type: String,
      required: true
   }
});

module.exports = mongoose.model(process.env.CARD_COLLECTION, cardSchema)