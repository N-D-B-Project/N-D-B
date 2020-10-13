const mongoose = require("mongoose");

const profileNDCashSchema = mongoose.Schema({
    emprego: {
        type: mongoose.SchemaTypes.String,
    },
      skin: {
        type: mongoose.SchemaTypes.String,
    },
      ndcash: {
        type: Number,
        default: 0,
    },
      propina: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("ProfileNDCash", profileNDCashSchema);