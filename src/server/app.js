/* eslint-disable no-console */
import { compileAmpTemplate } from './renderers/ampRenderer';
import createSsrHandler from './handlers/createSsrHandler';
import createAmpHandler from './handlers/createAmpHandler';
import steemAPI from './steemAPI';

const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require('https');

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

const OneWeek = 1000 * 60 * 60 * 24 * 7;

const app = express();
const server = http.Server(app);

const rootDir = path.join(__dirname, '../..');

app.locals.env = process.env;
app.enable('trust proxy');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(rootDir, 'public'), { maxAge: OneWeek, index: false }));
} else {
  app.use(express.static(path.join(rootDir, 'public'), { index: false }));
}

const indexPath = `${rootDir}/public/index.html`;
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

const ampIndexPath = `${rootDir}/templates/amp_index.hbs`;
const ampIndexHtml = fs.readFileSync(ampIndexPath, 'utf-8');
const ampTemplate = compileAmpTemplate(ampIndexHtml);

const ssrHandler = createSsrHandler(indexHtml);
const ampHandler = createAmpHandler(ampTemplate);

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

app.get('/i/@:referral', async (req, res) => {
  try {
    const { referral } = req.params;

    const accounts = await steemAPI.sendAsync('get_accounts', [[referral]]);
    if (accounts[0]) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/i/:parent/@:referral/:permlink', async (req, res) => {
  try {
    const { parent, referral, permlink } = req.params;

    const content = await steemAPI.sendAsync('get_content', [referral, permlink]);

    if (content.author) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect(`/${parent}/@${referral}/${permlink}`);
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/@:author/:permlink/amp', ampHandler);
app.get('/:category/@:author/:permlink/amp', (req, res) => {
  const { author, permlink } = req.params;
  res.redirect(301, `/@${author}/${permlink}/amp`);
});
app.get('/:category/@:author/:permlink', (req, res) => {
  const { author, permlink } = req.params;
  res.redirect(301, `/@${author}/${permlink}`);
});
app.get('/*', ssrHandler);

module.exports = { app, server };
