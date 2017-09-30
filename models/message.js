var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
    text: String,
    time: Date,
    author: String,
});

module.exports = mongoose.model("message", messageSchema);