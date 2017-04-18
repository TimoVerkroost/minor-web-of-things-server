var express = require('express');
var router = express.Router();
var request = require('request');
require('dotenv').config();

var weatherApi = {
    url: 'http://api.openweathermap.org/data/2.5/weather?q=amsterdam&units=metric&APPID=' + process.env.WEATHER_API_KEY
};
var server_url = process.env.SERVER_URL;

router.get('/', function (req, res, next) {
  getCurrentTemperture(req, res);

});

router.post('/', function (req, res) {
  getCurrentTemperture(req, res);
});

function getCurrentTemperture(req, res) {
    request(weatherApi.url, function (error, response, weatherData) {
      var temp = chooseTheDrink(Math.round(JSON.parse(weatherData).main.temp));
      // Sender ID
      var sender = "8C6E";
      // All devices that connected
      // var devices = ['19B4', '8EA6', '1DEA', '180F', 'CB1B', '8C6E'];
      var devices = ['8C6E'];
      // Get random device when page is requested
      var device = devices[Math.floor(Math.random()*devices.length)];
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
          console.log(device);
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

module.exports = router;
