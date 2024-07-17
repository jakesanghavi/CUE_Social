const User = require('../models/users.js')
const mongoose = require('mongoose')

// GET a specific user
const getUserByEmail = async (request, response) => {
  const { id } = request.params

  try {
    const userData = await User.findOne({ email_address: id });
    if (!userData) {
      // Returning 201 instead of the proper 404 prevents errors from coming up in the console.
      return response.status(201).json({ "error": "User does not exist" })
    }
    return response.status(200).json(userData)
  }
  catch (error) {
    return response.status(400).json({ error: error.message })
  }
}

// GET a specific user
const getUserByUsername = async (request, response) => {
  const { id } = request.params

  try {
    const userData = await User.findOne({ username: id });
    if (!userData) {
      // Returning 201 instead of the proper 404 prevents errors from coming up in the console.
      return response.status(201).json({ "error": "User does not exist" })
    }
    return response.status(200).json(userData)
  }
  catch (error) {
    return response.status(400).json({ error: error.message })
  }
}

// POST a user
const postUser = async (request, response) => {
  const email_address = request.body.email_address
  const username = request.body.username

  const existingUser = await User.findOne({ email_address: email_address });

  if (!existingUser) {
    // add a user to database if one with that email address doesn't exist
    try {
      const user = await User.create({ email_address, username })
      response.status(200).json(user)
    }
    catch (error) {
      console.log(error.message)
      response.status(400).json({ error: error.message })
    }
  }
}

// PATCH a user
const updateUser = async (request, response) => {
  const uid = request.body.uid
  const email = request.body.email_address
  const newUsername = request.body.username

  // Check if a user with these credentials already exists
  const existingUser = await User.findOne({ email_address: email });

  // If so, delete the temp user we made with the cookie ID. We can just reference their existing account
  if (existingUser) {
    // If a user exists, delete it
    const user = await User.findOneAndDelete({ username: uid });
    response.status(200).json(user)
  }
  // If a user with their credentials doesn't exist yet, edit their temp credentials to their new ones
  else {
    const user = await User.findOneAndUpdate(
      { username: uid },
      { $set: { email_address: email, username: newUsername } },
      { new: true } // This option returns the updated document
    );

  }
}

// GET all users
const getUsers = async (request, response) => {
  const users = await User.aggregate([
    { $match: { email_address: { $ne: null } } }, // Filter for non-null emails
    { $sort: { username: 1 } },
]);
  response.status(200).json(users)
}

module.exports = {
  getUserByUsername,
  getUserByEmail,
  postUser,
  updateUser,
  getUsers
}