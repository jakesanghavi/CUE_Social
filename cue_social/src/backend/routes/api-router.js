const express = require('express')
const multer = require('multer')

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    getHome,
    getCardByName,
    getCardByCode,
    getCards
} = require('../controllers/cardsController')

const {
    getUserByUsername,
    getUserByEmail,
    postUser ,
    updateUser,
    getUsers,
    getOneUser
} = require('../controllers/usersController')

const {
    getCookieUser,
    postCookieUser,
    updateCookieUser,
    deleteCookieUser,
} = require('../controllers/cookieUsersController')

const {
    postDeck,
    getDecksForUser,
    getOneDeck,
    getDecksBySearch,
    patchUpvotes
} = require('../controllers/deckController')

const { recognizeText } = require('../controllers/textrecognizer')

const router = express.Router()

// GET the homepage (prevent crashing)
router.get('/', getHome)

// GET a specific card by name
router.get('/api/cards/cardname/:id', getCardByName);

// GET a specific card by code
router.get('/api/cards/cardcode/:id', getCardByCode);

// GET all cards
router.get('/api/cards/', getCards);

// GET a specific user by email
router.get('/api/users/email/:id', getUserByEmail);

// GET a specific user by email
router.get('/api/users/username/:id', getUserByUsername);

// POST a user to the DB
router.post('/api/users/:id', postUser)

// PATCH a user in the DB
router.post('/api/users/patchcookie/:id', updateUser)

// GET all users
router.get('/api/users/getall', getUsers)

// GET a single user
router.get('/api/users/getone/:id', getOneUser)

// GET a specific user by cookie ID
router.get('/api/users/userID/:id', getCookieUser);

// POST a cookie user to the DB
router.post('/api/users/userID/post/:id', postCookieUser)

// PATCH a cookie user in the DB
router.post('/api/users/userID/patch/:id', updateCookieUser)

// DELETE a cookie user in the DB
router.post('/api/users/userID/del/:id', deleteCookieUser)

// GET a specific user by cookie ID
router.get('/api/users/userID/:id', getCookieUser);

// POST a specific deck
router.post('/api/decks/post', upload.single('image'), postDeck);

// GET decks for user
router.get('/api/decks/:id', getDecksForUser)

// GET decks for search
router.post('/api/decks/search-decks', getDecksBySearch);

// GET decks by ID
router.get('/api/decks/onedeck/:id', getOneDeck)

// PATCH deck by ID
router.post('/api/decks/onedeck/:id', patchUpvotes)

router.post('/api/uploadimage/', upload.single('image'), recognizeText)

module.exports = router