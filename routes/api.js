var express = require('express');
var router = express.Router();

router.get('/auth', function(req, res, next) {
  var user = req.user._json || [];
  res.json(user);
});


module.exports = router;