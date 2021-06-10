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
        type: Boolean,
        required: false,
        default: false,
    },
    antialt: {
        type: Boolean,
        required: false,
        default: false,
    },
    deletedlog: {
        type: Boolean,
        required: false,
        default: false,
    },
    reactionDM: {
        type: Boolean,
        default: true,
    }
    
});

module.exports = mongoose.model('GuildConfig', GuildConfigSchema);