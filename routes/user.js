var express = require('express');
var router = express.Router();

router.get('/test', function(req, res, next) {
  var Login = require('steemjs-lib/dist/chain/src/AccountLogin');
  var login = new Login();
  login.setRoles(["posting"]);
  var loginSuccess = login.checkKeys({
    accountName: "siol",
    password: "kohsamuiphuket36",
    auths: {
      posting: [["STM7SWWzw9LbzMvvS6WukeXNSqNSZAG5GJbh5u88DT7jGCWdrvgh1", 1]]
    }}
  );
  res.json({loginSuccess: loginSuccess, login: login});
});

router.get('/*', function(req, res, next) {
  res.render('user/dashboard', {layout: 'user', title: 'Busy'});
});

module.exports = router;