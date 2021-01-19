const mongoose = require('mongoose');

const GuildConfigSchema = new mongoose.Schema({
    guildName: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    prefix: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: '&',
    },
    language: {
        type: mongoose.SchemaTypes.String,
        required: false,
        default: "portuguese"
    },
});

module.exports = mongoose.model('GuildConfig', GuildConfigSchema);