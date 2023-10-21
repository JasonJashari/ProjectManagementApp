const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {type: String, required: true}
});

module.exports = mongoose.model('List', listSchema);
module.exports.listSchema = listSchema;