import express from 'express';

// eslint-disable-next-line import/no-unresolved
const assets = require('../../build/assets.json');

const app = express().get('/*', (req, res) => {
  res.status(200).send(
    `<!doctype html>
<html lang="">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    <title>Welcome to Busy</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="${assets.main.js}" defer></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>`,
  );
});

export default app;
