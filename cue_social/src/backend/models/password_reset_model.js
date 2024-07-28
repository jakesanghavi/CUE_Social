const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
});

module.exports = mongoose.model(process.env.RESETCOLLECTION, passwordResetSchema);