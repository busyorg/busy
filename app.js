const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

const OneWeek = 1000 * 60 * 60 * 24 * 7;

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('./webpack')(app);
}

app.enable('trust proxy');
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: OneWeek,
  index: process.env.NODE_ENV !== 'production' ? '../templates/development_index.html' : 'index.html',
}));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(cors());

app.locals.env = process.env;

module.exports = { app, server };
