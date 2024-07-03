require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const songRoutes = require('./routes/api-router')
const cors = require('cors');
const constants = require('../constants');

// middleware

//if the request has some data, attach it to the request
app.use(express.json())

app.use((request, response, next) => {
    console.log(request.path, request.method)
    next()
})

app.use(cors({
    origin: constants.ORIGIN,
    optionsSuccessStatus: 200
}))

// routes
app.use('/', songRoutes)

// connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to DB, listening on port " + process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })