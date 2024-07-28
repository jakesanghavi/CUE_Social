const User = require('../models/users.js')
const PasswordReset = require('../models/password_reset_model.js');
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SUPPORT_EMAIL, // Use environment variables for security
    pass: process.env.SUPPORT_PASSWORD,
  },
});

// GET a specific user
const getUserByEmail = async (request, response) => {
  const { id } = request.params

  try {
    const userData = await User.findOne({ email_address: id }).select('-password');;
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
    const userData = await User.findOne({ username: { $regex: new RegExp(`^${id}$`, 'i') } }).select('-password');;
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

  const generateRandomPassword = (minLength, maxLength) => {
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+?';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const password = request.body.password || generateRandomPassword(12, 16);

  const existingUser = await User.findOne({ email_address: email_address });

  if (!existingUser) {
    // add a user to database if one with that email address doesn't exist
    try {
      const user = await User.create({ email_address, username, password })
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
    { $project: { password: 0 } },
  ]);
  response.status(200).json(users)
}

const getOneUser = async (request, response) => {
  const { id } = request.params // Assuming you have user information in req.user

  try {
    const user = await User.findOne({ username: id }).select('-password');;
    response.status(200).json(user);
  } catch (error) {
    console.error('Error fetching decks:', error);
    response.status(500).json({ message: 'Server error' });
  }
}

// POST /login
const loginUserWithPassword = async (request, response) => {
  const { username, password } = request.query;
  try {
    // Find the user with the given username
    const user = await User.findOne({ username: username });

    // Check if the user exists and if the password matches
    if (user && user.password === password) {
      // Exclude the password field from the response
      const { password, ...userWithoutPassword } = user.toObject();
      response.status(200).json(userWithoutPassword);
    } else {
      response.status(404).json({ 0: 'User not found or incorrect password' });
    }
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

const forgotPassword = async (request, response) => {
  const { forgotEmail } = request.body;

  try {
    const user = await User.findOne({ email_address: forgotEmail });
    if (!user) {
      return response.status(400).send('No user found with that email.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour

    await PasswordReset.create({
      email: forgotEmail,
      token,
      expires,
    });

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const mailOptions = {
      from: process.env.SUPPORT_EMAIL,
      to: forgotEmail,
      subject: 'Password Reset',
      text: `Please click on the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    response.status(200).send('Password reset email sent.');
  } catch (error) {
    console.error('Error:', error);
    response.status(500).send('Failed to send email.');
  }
};

const resetPassword = async (request, response) => {
  const { token, password } = request.body;

  try {
    const reset = await PasswordReset.findOne({ token });
    if (!reset || reset.expires < Date.now()) {
      return response.status(400).send('Token is invalid or has expired.');
    }

    console.log(password)

    await User.findOneAndUpdate({ email_address: reset.email }, { password: password });

    await PasswordReset.deleteOne({ token });

    response.status(200).send('Password has been reset.');
  } catch (error) {
    console.error('Error:', error);
    response.status(500).send('Failed to reset password.');
  }
};

module.exports = {
  getUserByUsername,
  getUserByEmail,
  postUser,
  updateUser,
  getUsers,
  getOneUser,
  loginUserWithPassword,
  forgotPassword,
  resetPassword
}