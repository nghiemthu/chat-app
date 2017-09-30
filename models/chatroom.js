var mongoose = require("mongoose");

var chatroomSchema = new mongoose.Schema({
    members: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user"
      }
   ],
    messages: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "message"
      }
   ]
});

module.exports = mongoose.model("chatroom", chatroomSchema);