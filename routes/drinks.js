var express = require('express');
var router = express.Router();
var request = require('request');
require('dotenv').config();

var weatherApi = {
    url: 'http://api.openweathermap.org/data/2.5/weather?q=amsterdam&units=metric&APPID=' + process.env.WEATHER_API_KEY
}





/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('drinks', {
        title: 'Express'
    });

});

router.post('/', function (req, res) {
    console.log(getCurrentTemperture());
    res.render('drinks', {
        title: 'Express'
    });
})

function getCurrentTemperture() {
    request(weatherApi.url, function (error, response, weatherData) {
        chooseTheDrink(Math.round(JSON.parse(weatherData).main.temp)); 
    });
}

function chooseTheDrink(temperture) {
    switch (true){
    case temperture <= -5:
        // Tea color
        console.log("d0f0c0")
        break;
    case (temperture > -5) && (temperture <= 15):
        // Coffee color
        console.log("a46331")
        break;
    case temperture > 15:
        // Beer color
        console.log("ffff00")
        break;
    default:
        console.log('bier');
    }
}

module.exports = router;