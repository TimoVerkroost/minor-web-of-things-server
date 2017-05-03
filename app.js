var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sockIO = require('socket.io')();
var compression = require('compression');
var request = require('request');
require('dotenv').config();

var weatherApi = {
  url: 'http://api.openweathermap.org/data/2.5/weather?q=amsterdam&units=metric&APPID=' + process.env.WEATHER_API_KEY
};
var server_url = process.env.SERVER_URL;

var index = require('./routes/index');

var app = express();

app.use(compression());

// Init socket.io
app.sockIO = sockIO;

var devices = [];
sockIO.on('connection', function (socket) {

  function getOutsideTemp() {
    request(weatherApi.url, function (error, response, weatherData) {
      sockIO.emit('outside_temp', Math.round(JSON.parse(weatherData).main.temp));
    });
  }
  getOutsideTemp();
  setInterval(function(){
    getOutsideTemp();
  }, 60000);

  // Run after user is connected
  socket.on('connection_user', function(id, userID, userName){
    var totalConnected = sockIO.engine.clientsCount;
    socket.boxID = userID;
    socket.username = userName;
    // Get connected usernames
    userNames();
    boxIDs();
    // Save user data
    sockIO.emit('connection_user', socket.id, socket.boxID, socket.username, totalConnected);

    // User disconnect
    socket.on('disconnect', function(){
      var totalConnected = sockIO.engine.clientsCount;
      // Get connected usernames
      userNames();
      boxIDs();
      sockIO.emit('disconnect_user', socket.id, socket.boxID, socket.username, totalConnected);
      // Delete disconnected user from que
      var api_url_delete = "/api.php?t=rdc&d=8C6E&td=" + socket.boxID;
      var call_url_delete = server_url + api_url_delete;
      request(call_url_delete, function (error, response) {
        return response;
      });
    });
  });
  // Get all connected usernames
  function userNames() {
    var connectedUsers = [];
    var getAllConnected = Object.keys(sockIO.sockets.sockets);
    var i;
    for (i = 0; i < getAllConnected.length; i++) {
      connectedUsers.push(sockIO.sockets.connected[getAllConnected[i]].username);
      if (connectedUsers.length === getAllConnected.length) {
        sockIO.emit('get_all_connections', connectedUsers);
      }
    }
  }

  // Get all connected boxIDs
  function boxIDs() {
    // All devices that connected pushed from list
    devices = [];
    var getAllConnected = Object.keys(sockIO.sockets.sockets);
    var i;
    for (i = 0; i < getAllConnected.length; i++) {
      devices.push(sockIO.sockets.connected[getAllConnected[i]].boxID);
      if (devices.length === getAllConnected.length) {
        sockIO.emit('get_all_boxIDs', devices);
      }
    }
  }

});

app.use('/temp/:status/:temp', function (req, res, next) {
  res.send(req.params);
  sockIO.emit('coffee_ready', req.params.status);
  sockIO.emit('coffee_temp', req.params.temp);
});

app.use('/drinks', function (req, res, next) {
  var device = getRandomUser(devices);
  getCurrentTemperture(req, res, device);
  sockIO.emit('button_press', device);
});

function getCurrentTemperture(req, res, device) {
  request(weatherApi.url, function (error, response, weatherData) {
    var temp = chooseTheDrink(Math.round(JSON.parse(weatherData).main.temp));
    // Sender ID
    var sender = "8C6E";
    // Add new device to sender send list
    var api_url_new = "/api.php?t=sdc&d="+ sender +"&td="+ device +"&c="+ temp + "&m=JIJ GAAT KOFFIE HALEN!, JE GAAT ZELF KOFFIE HALEN!";
    var call_url_new = server_url + api_url_new;
    // Add new device request
    request(call_url_new, function (error, response, data) {
      res.locals.data =  JSON.parse(data);
      res.render('drinks', { device: device, color: temp });
    });
    // Delete others connected from send list request
    var i;
    for (i = 0; i < devices.length; i++) {
      var api_url_delete = "/api.php?t=rdc&d="+ sender +"&td=" + devices[i] + "&c="+ temp;
      var call_url_delete = server_url + api_url_delete;
      if (devices[i] !== device){
        request(call_url_delete, function (error, response) {
          return response;
        });
      } else {
        //console.log(device);
      }
    }

  });
}

function chooseTheDrink(temperture) {
  switch (true){
    case temperture <= -5:
      // Tea color
      return "d0f0c0";
    case (temperture > -5) && (temperture <= 15):
      // Coffee color
      return "a46331";
    case temperture > 15:
      // Beer color
      return "ffff00";
    default:
      return "ffff00";
  }
}

function getRandomUser(devices) {
  // Remove undefined from devices
  function removeA(devices) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && devices.length) {
      what = a[--L];
      while ((ax= devices.indexOf(what)) !== -1) {
        devices.splice(ax, 1);
      }
    }
    return devices;
  }
  removeA(devices, undefined);
  removeA(devices, null);
  // Get random device when page is requested
  var deviceSelect = devices[Math.floor(Math.random()*devices.length)];
  return deviceSelect;
}

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
