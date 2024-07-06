const express = require('express')

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
    updateUser
} = require('../controllers/usersController')

const {
    getCookieUser,
    postCookieUser,
    updateCookieUser,
    deleteCookieUser
} = require('../controllers/cookieUsersController')

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

module.exports = router