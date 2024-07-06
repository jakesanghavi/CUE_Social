const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cookieSchema = new Schema({
   userID: {
      type: String,
      required: true
   },
   email_address: {
      type: String,
      required: false
   }
});

module.exports = mongoose.model(process.env.COOKIE_USERS_COLLECTION, cookieSchema)