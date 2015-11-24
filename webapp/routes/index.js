var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.resobj.title = 'Smooth';
  res.render('index', req.resobj);
});

module.exports = router;
