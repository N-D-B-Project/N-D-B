const mongoose = require("mongoose");
const profileSchema = mongoose.Schema({
    level: {
        type: Number,
        default: 0,
    },
      exp: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Profile", profileSchema);