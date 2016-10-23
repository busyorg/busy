var express = require('express');
var router = express.Router();

router.get('/*', function (req, res, next) {
  res.render('user/dashboard', { layout: 'user', title: 'Busy' });
});

module.exports = router;
