const express = require('express')

const {
    getHome,
    getCardByName,
    getCardByCode,
    getCards
} = require('../controllers/cardsController')

const router = express.Router()

// GET the homepage (prevent crashing)
router.get('/', getHome)

// GET a specific card by name
router.get('/api/cards/cardname/:id', getCardByName);

// GET a specific card by code
router.get('/api/cards/cardcode/:id', getCardByCode);


// GET all cards
router.get('/api/cards/', getCards);

module.exports = router