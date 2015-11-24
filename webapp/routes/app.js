/**
 * Created by kascode on 16.06.15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('app', { title: 'Smooth' });
});

module.exports = router;
