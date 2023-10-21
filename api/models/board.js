const mongoose = require('mongoose');
const { listSchema } = require('./list');

const boardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {type: String, required: true},
    lists: [listSchema]
});

module.exports = mongoose.model('Board', boardSchema);