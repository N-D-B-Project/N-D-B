const mongoose = require('mongoose');

const DisableCommandsSchema = mongoose.Schema({
    //_id: Schema.Types.ObjectId,
    name: String,
    cmds: Array
});

module.exports = mongoose.model('DisableCommands', DisableCommandsSchema);