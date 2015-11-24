/**
 * Created by kascode on 12.08.15.
 */
var express = require('express');
var router = express.Router();
var models = require('../models/');

router.post('/', function(req, res, next) {
  var cont = models.Contributor.build({
    username: req.body.username
  }).save().then(function (o) {
    res.send(JSON.stringify({
      status: 'OK',
      id: o.id
    }));
  });
});

module.exports = router;