var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sockIO = require('socket.io')();
var compression = require('compression');

var index = require('./routes/index');
var drinks = require('./routes/drinks');

var app = express();

app.use(compression());

// Init socket.io
app.sockIO = sockIO;

sockIO.on('connection', function (socket) {
  // Run after user is connected
  socket.on('connection_user', function(id, userID, userName){
    socket.boxID = userID;
    socket.username = userName;
    // Get connected usernames
    userNames();
    // Save user data
    sockIO.emit('connection_user', socket.id, socket.boxID, socket.username);

    // User disconnect
    socket.on('disconnect', function(){
      // Get connected usernames
      userNames();
      sockIO.emit('disconnect_user', socket.id, socket.boxID, socket.username);
    });
  });
  // Get all connected usernames
  function userNames() {
    var connectedUsers = [];
    var getAllConnected = Object.keys(sockIO.sockets.sockets);
    var i;
    for (i = 0; i < getAllConnected.length; i++) {
      //console.log(sockIO.sockets.connected[getAllConnected[i]].username);
      connectedUsers.push(sockIO.sockets.connected[getAllConnected[i]].username);
      //console.log(getAllConnected[i]);
      if (connectedUsers.length === getAllConnected.length) {
        sockIO.emit('get_all_connections', connectedUsers);
      }
    }
  }

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/drinks', drinks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
