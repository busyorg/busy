/* eslint-disable new-cap,global-require,no-param-reassign */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const cors = require('cors');

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

const OneWeek = 1000 * 60 * 60 * 24 * 7;

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

const rootDir = path.join(__dirname, '..');

if (process.env.NODE_ENV !== 'production') { require('../webpack')(app); }

app.enable('trust proxy');
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(rootDir, 'public'), {
    maxAge: OneWeek,
  }));

  app.get('/*', (req, res) => {
    res.sendFile('index.html', {
      root: `${rootDir}/public/`,
    });
  });
} else {
  app.use(express.static(path.join(rootDir, 'assets')));

  app.get('/*', (req, res) => {
    res.sendFile('development_index.html', {
      root: path.resolve(`${rootDir}/templates/`),
    });
  });
}
app.use(express.static(path.join(rootDir, 'node_modules')));

app.use(cors());

app.locals.env = process.env;

module.exports = { app, server };
