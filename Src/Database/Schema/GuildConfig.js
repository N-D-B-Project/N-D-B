const mongoose = require('mongoose');

const GuildConfigSchema = new mongoose.Schema({
    guildName: {
        type: String,
        required: true,
        unique: true,
    },
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    prefix: {
        type: String,
        required: true,
        default: '&',
    },
    language: {
        type: String,
        required: false,
        default: "pt"
    },
    antispam: {
        type: String,
        required: false,
        default: false,
    },
    antialt: {
        type: String,
        required: false,
        default: false,
    },
    deletedlog: {
        type: String,
        required: false,
        default: false,
    }
    
});

module.exports = mongoose.model('GuildConfig', GuildConfigSchema);