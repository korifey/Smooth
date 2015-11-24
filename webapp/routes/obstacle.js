var express = require('express');
var router = express.Router();
var models = require('../models/');

/* GET users listing. */
router.post('/', function(req, res, next) {
  var obstacle = models.Obstacle.build({
    address: req.body.address,
    lat: parseFloat(req.body.lat),
    lng: parseFloat(req.body.lng),
    photoPath: req.files.obstacleImage.path
  }).save().then(function (o) {
    res.send(JSON.stringify({
      status: 'OK',
      id: o.id
    }));
  })
});

module.exports = router;
