/**
 * Created by kascode on 03.09.15.
 */
var express = require('express');
var router = express.Router();
var locale = require('../public/javascripts/locale');

/* GET users listing. */
router.post('/', function(req, res, next) {
  if (req.body.lang) {
    if (typeof locale[req.body.lang] !== 'undefined') {
      req.session.lang = req.body.lang;
      global.sess = req.session;

      res.send(JSON.stringify({
        status: "OK",
        message: "Language changed to " + req.body.lang
      }));
    } else {
      res.send(JSON.stringify({
        status: "ERROR",
        message: "No translation to this language [" + req.body.lang + "]"
      }));
    }
  } else {
    res.send(JSON.stringify({
      status: "ERROR",
      message: "No language specified"
    }));
  }
});

module.exports = router;
