const mongoose = require('mongoose');

const GuildConfigChannelsSchema = new mongoose.Schema({
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
    logChannel: {
        type: String,
        required: false,
    },
    floodChannel: {
        type: String,
        required: false,
    },
    XpChannelId: {
        type: String,
        required: false,
    },
    VerificationChannelId: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('GuildConfigChannels', GuildConfigChannelsSchema);