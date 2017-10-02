var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
    text: String,
    date: Date,
    author: String,
});

module.exports = mongoose.model("message", messageSchema);