const Card = require('../models/card_model.js')
const mongoose = require('mongoose')

// GET the homepage
const getHome = async (request, response) => {
  return response.send("Backend landing page");
}

// GET a specific user
const getCardByName = async (request, response) => {
  const { id } = request.params

  try {
    const cardData = await Card.findOne({ Name: id });
    if (!cardData) {
      // Returning 201 instead of the proper 404 prevents errors from coming up in the console.
      return response.status(201).json({ "error": "Card does not exist" })
    }
    return response.status(200).json(cardData)
  }
  catch (error) {
    return response.status(400).json({ error: error.message })
  }
}

// GET a specific user
const getCardByCode = async (request, response) => {
  const { id } = request.params

  try {
    const cardData = await Card.findOne({ Code: id });
    if (!cardData) {
      // Returning 201 instead of the proper 404 prevents errors from coming up in the console.
      return response.status(201).json({ "error": "Card does not exist" })
    }
    return response.status(200).json(cardData)
  }
  catch (error) {
    console.log(error)
    return response.status(400).json({ error: error.message })
  }
}

// GET all songs
const getCards = async (request, response) => {
  const songs = await Card.find({}).sort({ createdAt: -1 })
  response.status(200).json(songs)
}

module.exports = {
  getHome,
  getCardByName,
  getCardByCode,
  getCards
}