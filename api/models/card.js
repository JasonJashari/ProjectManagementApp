const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    listId: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    desc: String
});

module.exports = mongoose.model('Card', cardSchema);