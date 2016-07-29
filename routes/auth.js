var express = require('express');
var router = express.Router();

router.get('/signup', function(req, res) {
  res.render('auth/signup', {
    layout: 'auth',
    title: 'Sign Up',
    //callback: callback
  });
});

router.get('/login', function(req, res) {
  var next = req.query.next || '';
  //var callback = process.env.AUTH0_CALLBACK_URL;
  //callback = (next)? callback + '?next=' + next : callback;
  res.render('auth/login', {
    layout: 'auth',
    title: 'Log In',
    //callback: callback
  });
});

router.get('/logout', function(req, res) {

});


module.exports = router;