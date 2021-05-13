const mongoose = require('mongoose');

const GuildConfigChannelsSchema = new mongoose.Schema({
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
    logChannel: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    floodChannel: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    XpChannelId: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    VerificationChannelId: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
});

module.exports = mongoose.model('GuildConfigChannels', GuildConfigChannelsSchema);