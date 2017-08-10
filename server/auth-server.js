/**
 * Express.js server used for handling callback request after loging in.
 */

const express = require('express');

const app = express();

app.get('/callback', (req, res) => {
  const access_token = req.query.access_token;
  const expires_in = req.query.expires_in;
  if (access_token && expires_in) {
    res.cookie('access_token', access_token, { maxAge: expires_in * 1000 });
    res.redirect('/');
  } else {
    res.status(401).send({ error: 'access_token or expires_in Missing' });
  }
});

const server = app.listen(3001, 'localhost', function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Auth server running at http://%s:%s/', host, port);
});
