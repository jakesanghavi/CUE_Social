const Comment = require('../models/comments_model.js')
const mongoose = require('mongoose')

const getCommentsByDeck = async (request, response) => {
    const { id } = request.params;

    try {
        const matches = await Comment.find({ DeckID: id });
        console.log(matches)
        if (matches.length === 0) {
            // Returning 201 instead of the proper 404 prevents errors from coming up in the console.
            return response.status(201).json({ "comments": [] });
        }
        return response.status(200).json(matches);
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
}

const postComment = async (request, response) => {
    const { id } = request.params
    const { username, comment } = request.body;
    const createdAt = new Date().toISOString();

    if (!username) {
        response.status(400).json({ error: 'Not logged in!' });
        return;
    }

    try {
        const commentAdd = await Comment.create({
            DeckID: id,
            Username: username,
            Comment: comment,
            createdAt
        });

        response.status(200).json(commentAdd);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

const deleteComment = async (request, response) => {
    const { id } = request.params;

    if (!id) {
        response.status(400).json({ error: 'Comment ID is required!' });
        return;
    }

    try {
        const deletedComment = await Comment.findOneAndDelete({ _id: id });

        if (!deletedComment) {
            return response.status(404).json({ error: 'Comment not found!' });
        }

        response.status(200).json({ message: 'Comment deleted successfully', deletedComment });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

const updateComment = async (request, response) => {
    const { id } = request.params;
    const { username, comment } = request.body;

    if (!id) {
        response.status(400).json({ error: 'Comment ID is required!' });
        return;
    }

    if (!username && !comment) {
        response.status(400).json({ error: 'No update fields provided!' });
        return;
    }

    const updateFields = {};
    if (username) updateFields.Username = username;
    if (comment) updateFields.Comment = comment;

    try {
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: id },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedComment) {
            return response.status(404).json({ error: 'Comment not found!' });
        }

        response.status(200).json({ message: 'Comment updated successfully', updatedComment });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

module.exports = {
    getCommentsByDeck,
    postComment,
    deleteComment,
    updateComment
}