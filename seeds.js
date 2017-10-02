var mongoose  = require("mongoose");
var Chatroom  = require("./models/chatroom");
var Message   = require("./models/message");
var User      = require("./models/user");

var data = [
  {
    members: [
      { name: 'thunghiem', avatar: 'default' }, 
      { name: 'peter', avatar: 'http://i.dailymail.co.uk/i/pix/2017/04/20/13/3F6B966D00000578-4428630-image-m-80_1492690622006.jpg' }],
    messages: [
      {
        text: 'Hello',
        date: Date.now(),
        author: 'thunghiem'
      }, {
        text: 'Hi',
        date: Date.now(),
        author: 'peter'
      }, {
        text: 'How are you?',
        date: Date.now(),
        author: 'thunghiem'
      },
    ]
  }, {
    members: [{ name: 'thunghiem', avatar: 'default' }, 
    { name: 'alex', avatar: 'http://blog.chemistry.com/wp-content/uploads/2012/09/man-smiling.jpg' }],
    messages: [
      {
        text: `What's up?`,
        date: Date.now(),
        author: 'thunghiem'
      }, {
        text: 'Hi! How you doing?',
        date: Date.now(),
        author: 'alex'
      }, {
        text: 'Good!',
        date: Date.now(),
        author: 'thunghiem'
      },
    ]
  },
];

function seedDB(){
  
  
  Chatroom.remove({}, function(err){
    if(err){
        console.log(err);
    }
    console.log("removed chatrooms!");
    
    data.map(function(item){
      Chatroom.create({}, function(err, chatroom) {
        if (err) { console.log(err); return; }
  
        item.members.map(function(member, index){
          User.create(member, function(err, _member){
            if (err)
              console.log(err);
            else {
              
              chatroom.members.push(_member);
              
              if (index == item.members.length-1) {
                item.messages.map(function(message, index){
                  Message.create(message, function(err, _message){
                    if (err)
                      console.log(err);
                    else {
                      chatroom.messages.push(_message);
                    
                       if (index == item.messages.length-1) {
                         chatroom.save();
                       } 
                    }
                  });
                });
              }
            }
          });
        });
      });
    });   
  });
}

module.exports = seedDB;
