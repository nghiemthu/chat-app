var Message         = require("../models/message");
var Chatroom        = require("../models/chatroom");
var User            = require("../models/user");

function Format() {
    this.setter = function(text) {
      this.text = text;
    }
    this.show = function() {
      console.log(this.text);
    } 
}

module.exports = {
  sendMessage: function(roomId, text, user, callback) {
    Chatroom.findById(roomId, function(err, chatroom){
      if(err) console.log (err);
      else {
        Message.create({}, function(err, message){
          if(err) console.log (err);
          else {
            if (!chatroom) return '';
            
            message.text = text;
            message.date = Date.now();
            message.author = user;
            message.save();
            
            chatroom.messages.push(message);
            chatroom.save();
            
            callback(message);
          }
        });
      }
    });
  },
  createChatroom: function(roomId, user, receiver) {
    Chatroom.create({}, function(err, chatroom){
      if(err) console.log (err);
      else {
        User.findOne({'name': user}, function(err, user){
          if (err) console.log(err);
          else {
            chatroom.members.push(user);
            
            User.findOne({'name': receiver}, function(err, user){
              if (err) console.log(err);
              else if (user) {
                chatroom.members.push(user);
                chatroom.save();
              }
            });
          }
        });
      }
    });
  }
};