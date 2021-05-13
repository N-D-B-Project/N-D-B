const mongoose = require('mongoose');

const GuildConfigRolesSchema = new mongoose.Schema({
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
    defaultRole: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    mutedRole: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
});

module.exports = mongoose.model('GuildConfigRoles', GuildConfigRolesSchema);