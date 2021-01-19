const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true
}

const LanguageSchema = new mongoose.Schema({
    _id: reqString,
    _Name: reqString,
    language: reqString
});

module.exports = mongoose.model('Languages', LanguageSchema);