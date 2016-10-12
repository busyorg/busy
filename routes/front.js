var express = require('express');
var router = express.Router();

var steemconnect = require('steemconnect');

router.all('/token', function(req, res, next) {
  var token = req.body.token || req.query.token || false;
  steemconnect.token.verify(token, function(err, result) {
    res.json(result);
  });
});

router.get('/*', function(req, res, next) {
  res.render('user/dashboard', {layout: 'user', title: 'Busy'});
});

module.exports = router;
