const mongoose = require('mongoose');

const GuildConfigRolesSchema = new mongoose.Schema({
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
    defaultRole: {
        type: String,
        required: false,
    },
    mutedRole: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('GuildConfigRoles', GuildConfigRolesSchema);