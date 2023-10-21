const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
require('dotenv').config();

const Card = require('../models/card');
const List = require('../models/list');

router.get('/', (req, res, next) => {
    Card.find()
    .select('title desc listId _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            cards: docs.map(doc => {
                return {
                    title: doc.title,
                    desc: doc.desc,
                    listId: doc.listId,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: process.env.CARD_URL + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', checkAuth, (req, res, next) => {
    // Check list exists
    List.findById(req.body.listId)
    .then(list => {
        const card = new Card({
            _id: new mongoose.Types.ObjectId(),
            listId: list._id,
            title: req.body.title,
            desc: req.body.desc
        });
        return card.save()
    })
    .then(card => {
        res.status(201).json({
            createdCard: {
                _id: card._id,
                title: card.title,
                desc: card.desc,
                listId: card.listId
            },
            request: {
                type: 'GET',
                url: process.env.CARD_URL + card._id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:cardId', (req, res, next) => {
    const id = req.params.cardId;
    Card.findById(id)
    .select('title desc listId _id')
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided ID'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:cardId', checkAuth, (req, res, next) => {
    const id = req.params.cardId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Card.updateOne({_id: id}, {$set: updateOps}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Card updated!',
            request: {
                type: 'GET',
                url: process.env.CARD_URL + id
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

router.delete('/:cardId', checkAuth, (req, res, next) => {
    const id = req.params.cardId;
    // Check card exists
    Card.findById(id).exec()
    .then(card => {
        // delete card
        Card.deleteOne({_id: card._id})
        .exec()
    })
    .then(result => {
        res.status(204).json();
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;