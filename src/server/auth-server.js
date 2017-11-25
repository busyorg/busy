/* eslint-disable no-console */
/**
 * Express.js server used for handling callback request after loging in.
 */

const express = require('express');
const steem = require('steem');

if (process.env.STEEMJS_URL) {
  steem.api.setOptions({ url: process.env.STEEMJS_URL });
}

const app = express();

app.get('/callback', (req, res) => {
  const accessToken = req.query.access_token;
  const expiresIn = req.query.expires_in;
  const state = req.query.state;
  const next = state && state[0] === '/' ? state : '/';
  if (accessToken && expiresIn) {
    res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000 });
    res.redirect(next);
  } else {
    res.status(401).send({ error: 'access_token or expires_in Missing' });
  }
});

app.get('/i/@:referral', (req, res) => {
  const { referral } = req.params;
  steem.api.getAccountsAsync([referral]).then((accounts) => {
    if (accounts[0]) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect(`/@${referral}`);
    } else {
      res.redirect('/');
    }
  }).catch(() => {
    res.redirect('/');
  });
});

const server = app.listen(3001, 'localhost', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Auth server running at http://%s:%s/', host, port);
});
