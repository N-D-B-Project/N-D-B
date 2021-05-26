const mongoose = require('mongoose');

const BlacklistSchema = mongoose.Schema({
    User: String,
    Blacklist: Boolean
});

module.exports = mongoose.model('Blacklist', BlacklistSchema);