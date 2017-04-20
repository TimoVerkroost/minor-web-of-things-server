var express = require('express');
var router = express.Router();

require('dotenv').config();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {
  res.locals.form = req.body;

  res.render('index');
});

module.exports = router;
