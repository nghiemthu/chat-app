var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    seedDB          = require("./seeds"),
    bodyParser      = require("body-parser");
    
var Chatroom  = require("./models/chatroom"),
    Message   = require("./models/message"),
    User      = require("./models/user");

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());

mongoose.connect("mongodb://thunghiem:12345@ds159254.mlab.com:59254/chat-app", { useMongoClient: true });
mongoose.Promise = require('bluebird');

//seedDB();

app.get('/index', function(req, res){
  res.send("Hello!");
});

app.get('/chatrooms', function(req, res){
   Chatroom.find({}).populate("messages").populate("members").exec(function(err, chatroom) {
     if (err) return res.send(err);
     
     return res.json(chatroom);
   });
});

app.get('/chatrooms/:name', function(req, res){
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

app.get('/chatrooms/searchById/:id', function(req, res){
   Chatroom.findById(req.params.id)
    .populate("messages").populate("members")
    .exec(function(err, _chatrooms) {
      if (err) return res.send(err);
      
      return res.json(_chatrooms);
    });
});

app.post('/chatrooms', function(req, res){
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

app.post('/chatrooms/:id', function(req, res){
  Chatroom.findById(req.params.id, function(err, chatroom){
    if(err) console.log (err);
    else {
      Message.create({}, function(err, message){
        if(err) console.log (err);
        else {

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

app.get('/', function(req, res){
  res.send("Welcome!");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server started');
})