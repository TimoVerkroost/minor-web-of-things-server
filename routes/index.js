var express = require('express');
var router = express.Router();
var request = require('request');

require('dotenv').config();

var weatherApi = {
  url: 'http://api.openweathermap.org/data/2.5/weather?q=amsterdam&units=metric&APPID=' + process.env.WEATHER_API_KEY
};
var server_url = process.env.SERVER_URL;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {
  res.locals.form = req.body;

  res.render('index');
});

module.exports = router;
