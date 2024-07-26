const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
   email_address: {
      type: String,
      required: false
   },
   username: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   }
});

module.exports = mongoose.model(process.env.GOOGLE_USERS_COLLECTION, userSchema)