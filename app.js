var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    seedDB          = require("./seeds"),
    bodyParser      = require("body-parser");
    
var Chatroom        = require("./models/chatroom"),
    Message         = require("./models/message"),
    User            = require("./models/user");

var routers         = require("./routes");

var utils           = require("./utils");

var server = app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server started');
});

var io = require('socket.io').listen(server);

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());

mongoose.connect("mongodb://thunghiem:12345@ds159254.mlab.com:59254/chat-app", { useMongoClient: true });
mongoose.Promise = require('bluebird');

seedDB();

app.use("", routers);

io.on('connection', (socket) => {
  socket.on('room.join', (room) => {
    // Object.keys(socket.rooms).filter((r) => r != socket.id)
    // .forEach((r) => socket.leave(r));

    socket.join(room);
    socket.emit('event', 'Joined room ' + room);
  });
  
  socket.on('message', (e) => {
    utils.sendMessage(e.room, e.text, e.user, (message) => {
      io.sockets.in(e.room).emit('message', message);
    });
  });
});


