const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const checkAuth = require('../middleware/check-auth');
require('dotenv').config();

const List = require('../models/list');
const User = require('../models/user');

router.get('/', checkAuth, (req, res, next) => {
    List.find({ user: req.userData.userId })
    .select('title _id')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            lists: docs.map(doc => {
                return {
                    _id: doc._id,
                    title: doc.title,
                    request: {
                        type: 'GET',
                        url: process.env.LIST_URL + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', checkAuth, (req, res, next) => {
    const list = new List({
        _id: new mongoose.Types.ObjectId(),
        user: req.userData.userId,
        title: req.body.title
    });
    list.save()
    .then(result => {
        res.status(201).json({
            message: 'List created!',
            createdList: {
                _id: result._id,
                title: result.title,
            },
            request: {
                type: 'GET',
                url: process.env.LIST_URL + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:listId', checkAuth, asyncHandler(async (req, res, next) => {

    try {
        const list = await List.findById(req.params.listId);
        const user = await User.findById(req.userData.userId);

        if (!user) {
            return res.status(401).json({
                error: 'User not found'
            });
        }

        // Make sure logged in user matches the list user
        if (list.user.toString() === user.id) {
            res.status(200).json(list);
        } else {
            res.status(401).json({
                error: 'User not authorized'
            });
        }

    } catch (err) {
        return res.status(404).json({
            message: 'List not found'
        });
    }

}));

router.patch('/:listId', checkAuth, asyncHandler(async (req, res, next) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    
    // Check list exists
    try {
        const list = await List.findById(req.params.listId);
        const user = await User.findById(req.userData.userId);

        // Check for user
        if (!user) {
            return res.status(401).json({
                error: 'User not found'
            });
        }

        // Make sure the logged in user matches the list user
        if (list.user.toString() === user.id) {
            const list = await List.findByIdAndUpdate({_id: req.params.listId}, {$set: updateOps});
            res.status(200).json({
                message: 'List updated!',
                request: {
                    type: 'GET',
                    url: process.env.LIST_URL + list._id
                }
            });
        } else {
            res.status(401).json({
                error: 'User not authorized'
            });
        }

    } catch (err) {
        return res.status(404).json({
            error: 'List not found'
        });
    }
}));


router.delete('/:listId', checkAuth, asyncHandler(async(req, res, next) => {
    try {
        const list = await List.findById(req.params.listId);
        const user = await User.findById(req.userData.userId);

        if (!user) {
            return res.status(401).json({
                error: 'User not found'
            });
        }

        // Make sure the logged in user matches the list user
        if (list.user.toString() === user.id) {
            await List.deleteOne(list)
            res.status(200).json();
        } else {
            res.status(401).json({
                error: 'User not authorized'
            });
        }

    } catch (err) {
        res.status(404).json({
            error: 'List not found'
        });
    }
}));

module.exports = router;