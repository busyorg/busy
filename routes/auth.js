var express = require('express');
var router = express.Router();
var requiresLogin = require('../requiresLogin');
var passport = require('passport');

router.get('/signup', function(req, res) {
  var next = req.query.next || '';
  var callback = process.env.AUTH0_CALLBACK_URL;
  callback = (next)? callback + '?next=' + next : callback;
  res.render('auth/signup', {
    layout: 'auth',
    title: 'Sign Up',
    callback: callback
  });
});

router.get('/login', function(req, res) {
  var next = req.query.next || '';
  var callback = process.env.AUTH0_CALLBACK_URL;
  callback = (next)? callback + '?next=' + next : callback;
  res.render('auth/login', {
    layout: 'auth',
    title: 'Log In',
    callback: callback
  });
});

router.get('/logout', function(req, res) {
  var returnTo = req.protocol + '://' + req.get('host');
  res.redirect('https://' + process.env.AUTH0_DOMAIN + '/v2/logout?returnTo=' + encodeURIComponent(returnTo));
});

// Auth0 callback handler
router.get('/callback', passport.authenticate('auth0', { failureRedirect: '/login' }), function(req, res) {
  var next = req.query.next || '/';
  if (!req.user) {
    throw new Error('user null');
  }
  res.redirect(next);
});

module.exports = router;