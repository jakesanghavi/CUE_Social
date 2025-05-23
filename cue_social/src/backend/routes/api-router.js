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
    getOneUser,
    loginUserWithPassword,
    forgotPassword,
    resetPassword
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
    patchUpvotes,
    deleteOneDeck,
    editDeck,
    getCuratedDecks
} = require('../controllers/deckController')

const {
    getCommentsByDeck,
    postComment,
    deleteComment,
    updateComment
} = require('../controllers/commentsController')

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

// POST a user to see if credentials are right
router.get('/api/users/passwordlogin', loginUserWithPassword)

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

// GET curated decks
router.post('/api/decks/get-curated', getCuratedDecks);

// GET decks by ID
router.get('/api/decks/onedeck/:id', getOneDeck)

// PATCH deck by ID
router.post('/api/decks/onedeck/:id', patchUpvotes)

// DELETE deck by ID
router.delete('/api/decks/deleteone/:id', deleteOneDeck)

// Recognize the image
router.post('/api/uploadimage/', upload.single('image'), recognizeText)

// PATCH deck by ID (non-upvotes)
router.post('/api/decks/editdeck/:id', editDeck)

// REQUEST PASSWORD RESET
router.post('/api/request-password-reset/', forgotPassword)

// RESET PASSWORD
router.post('/api/reset-password/', resetPassword);

// GET comments by Deck
router.get('/api/comments/get/:id', getCommentsByDeck)

// POST a comment
router.post('/api/comments/post/:id', postComment)

// DELETE a comment
router.delete('/api/comments/delete/:id', deleteComment)

// PATCH a comment by ID
router.post('/api/comments/patch/:id', updateComment)

module.exports = router