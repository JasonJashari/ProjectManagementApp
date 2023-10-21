const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const checkAuth = require('../middleware/check-auth');
const Board = require('../models/board');
const User = require('../models/user');

router.get('/', checkAuth, asyncHandler(async (req, res, next) => {
    const boards = await Board.find({ user: req.userData.userId }).exec();
    
    return res.status(200).json({
        count: boards.length,
        boards: boards.map(board => {
            return {
                id: board._id,
                title: board.title,
                request: {
                    type: 'GET',
                    url: process.env.BOARD_URL + board._id
                }
            }
        })
    });
}));

router.post('/', checkAuth, asyncHandler(async (req, res, next) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            message: 'Please provide a title'
        });
    }

    const board = await Board.create({
        _id: new mongoose.Types.ObjectId(),
        user: req.userData.userId,
        title: title
    });

    if (board) {
        res.status(201).json({
            message: 'Board created!',
            createdBoard: {
                id: board._id,
                title: board.title,
            },
            request: {
                type: 'GET',
                url: process.env.BOARD_URL + board._id
            }
        });
    } else {
        res.status(400).json({
            message: 'Invalid board data'
        });
    }

}));

router.get('/:boardId', checkAuth, asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.userData.userId).exec();

    try {
        // If req.params.boardId is not a valid format for a mongo ID string
        // that will throw an exception which you must catch.
        const board = await Board.findById(req.params.boardId).exec();

        if (!board) {
            return res.status(404).json({
                message: 'Board not found'
            });
        }

        // Make sure logged in user matches the board user
        if (board.user.toString() === user.id) {
            res.status(200).json(board);
        } else {
            res.status(401).json({
                error: 'User not authorized'
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid board ID'
        });
    }
}));


router.patch('/:boardId', checkAuth, asyncHandler (async (req, res, next) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    
    const user = await User.findById(req.userData.userId).exec();

    try {
        // If req.params.boardId is not a valid format for a mongo ID string
        // that will throw an exception which you must catch.
        const board = await Board.findById(req.params.boardId).exec();

        if (!board) {
            return res.status(404).json({
                message: 'Board not found'
            });
        }

        // Make sure logged in user matches the board user
        if (board.user.toString() === user.id) {
            await Board.findByIdAndUpdate({ _id: req.params.boardId }, { $set: updateOps });
            res.status(200).json({
                message: 'Board updated!'
            });
        } else {
            res.status(401).json({
                error: 'User not authorized'
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid board ID'
        });
    }
}));

router.delete('/:boardId', checkAuth, asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.userData.userId).exec();

    try {
        // If req.params.boardId is not a valid format for a mongo ID string
        // that will throw an exception which you must catch.
        const board = await Board.findById(req.params.boardId).exec();

        if (!board) {
            return res.status(404).json({
                message: 'Board not found'
            });
        }

        // Make sure logged in user matches the board user
        if (board.user.toString() === user.id) {
            await Board.deleteOne({ _id: board._id });
            res.status(200).json();
        } else {
            res.status(401).json({
                error: 'User not authorized'
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid board ID'
        });
    }
}));


module.exports = router;