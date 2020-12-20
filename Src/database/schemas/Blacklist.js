const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    User: String,
    Blacklist: Boolean
});

module.exports = mongoose.model('Blacklist', Schema);