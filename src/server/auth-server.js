/* eslint-disable no-console */
/**
 * Express.js server used for handling callback request after loging in.
 */

const express = require('express');

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

const server = app.listen(3001, 'localhost', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Auth server running at http://%s:%s/', host, port);
});
