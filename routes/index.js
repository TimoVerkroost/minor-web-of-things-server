var express = require('express');
var router = express.Router();
var request = require('request');

require('dotenv').config();

var server_url = process.env.SERVER_URL || 3000;

/* GET home page. */
router.get('/', function(req, res, next) {
  var api_url = "/api.php?t=sdc&d=T111&td=T222&c=ff0000";
  var callURL = server_url + api_url;
  request(callURL, function (error, response, data) {
    res.locals.data =  JSON.parse(data);
    res.render('index', { title: 'Express' });
  });
});

// router.post('/' function(req, res, next) {
//   console.log('hey')
// })

module.exports = router;
