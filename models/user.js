var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    avatar: String
},{strict: true});

module.exports = mongoose.model("user", userSchema);