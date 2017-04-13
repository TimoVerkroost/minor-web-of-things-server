var express = require('express');
var router = express.Router();
var request = require('request');
var http = require('http');

require('dotenv').config();


/* GET home page. */
router.get('/', function(req, res, next) {
  // Sender ID
  var sender = "8C6E";
  // All devices that connected
  var devices = ['19B4', '8EA6', '1DEA', '180F', 'CB1B'];
  // Get random device when page is requested
  var device = devices[Math.floor(Math.random()*devices.length)];
  // Add new device to sender send list
  var api_url_new = "/api.php?t=sdc&d="+ sender +"&td="+ device +"&c=8e44ad";
  var call_url_new = server_url + api_url_new;
  // Add new device request
  request(call_url_new, function (error, response, data) {
    res.locals.data =  JSON.parse(data);
    res.render('index', { device: device });
  });
  // Delete others connected from send list request
  var i;
  for (i = 0; i < devices.length; i++) {
    var api_url_delete = "/api.php?t=rdc&d="+ sender +"&td=" + devices[i] + "&c=8e44ad";
    var call_url_delete = server_url + api_url_delete;
    if (devices[i] !== device){
      request(call_url_delete, function (error, response) {
        return response;
      });
    } else {
      console.log(device);
    }
  }
});

// router.post('/' function(req, res, next) {
//   console.log('hey')
// })

module.exports = router;
