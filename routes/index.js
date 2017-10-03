var express         = require("express");
var router          = express.Router();
var Message         = require("../models/message");
var Chatroom        = require("../models/chatroom");
var User            = require("../models/user");

router.get('/index', function(req, res){
  res.send("Hello!");
});

router.get('/chatrooms', function(req, res){
   Chatroom.find({}).populate("messages").populate("members").exec(function(err, chatroom) {
     if (err) return res.send(err);
     
     return res.json(chatroom);
   });
});

router.get('/chatrooms/:name', function(req, res){
   User.findOneAndUpdate({name: req.params.name}, {name: req.params.name, avatar: 'default'}, { upsert: true}, function(err, _member){
     if (err) console.log(err);
     Chatroom.find({})
      .populate("messages").populate("members")
      .exec(function(err, _chatrooms) {
        if (err) return res.send(err);
        console.log(req.params.name);
        
        var chatrooms = _chatrooms.filter(function(chatroom){
          return chatroom.members.some(function(member){
            return member.name == req.params.name;
          });
        });
        
        return res.json(chatrooms);
      }); 
   });
});

router.get('/chatrooms/searchById/:id', function(req, res){
   Chatroom.findById(req.params.id)
    .populate("messages").populate("members")
    .exec(function(err, _chatrooms) {
      if (err) return res.send(err);
      
      return res.json(_chatrooms);
    });
});

router.get('/users/:name', function(req, res){
   User.findOne({'name': req.params.name}).exec(function(err, user) {
      if (err) return res.send(err);
      
      return res.json(user);
    });
});

router.get('/users', function(req, res){
   User.find({}).exec(function(err, users) {
      if (err) return res.send(err);
      
      return res.json(users);
    });
});

router.post('/chatrooms', function(req, res){
  Chatroom.create({}, function(err, chatroom){
    if(err) console.log (err);
    else {
      User.findOne({'name': req.body.user}, function(err, user){
        if (err) console.log(err);
        else {
          chatroom.members.push(user);
          
          User.findOne({'name': req.body.receiver}, function(err, user){
            if (err) console.log(err);
            else {
              if (user) {
                chatroom.members.push(user);
                chatroom.save();
                Chatroom.findById(chatroom.id)
                  .populate("messages").populate("members")
                  .exec(function(err, _chatrooms) {
                    if (err) return res.send(err);
                    
                    res.json(_chatrooms);
                  });
              } else {
                res.send("Cannot find user");
              }
            }
          });
        }
      });
    }
  })
});

router.post('/chatrooms/:id', function(req, res){
  Chatroom.findById(req.params.id, function(err, chatroom){
    if(err) console.log (err);
    else {
      Message.create({}, function(err, message){
        if(err) console.log (err);
        else {
          if (!chatroom) return res.send("Cannot find chatroom");
          
          message.text = req.body.text;
          message.date = Date.now();
          message.author = req.body.user;
          message.save();
          
          chatroom.messages.push(message);
          chatroom.save();
          
          Chatroom.findById(chatroom.id)
            .populate("messages").populate("members")
            .exec(function(err, _chatrooms) {
              if (err) return res.send(err);
              
              res.json(_chatrooms);
            });
        }
      });
    }
  })
});

router.get('/', function(req, res){
  res.send("Welcome!");
});


module.exports = router;