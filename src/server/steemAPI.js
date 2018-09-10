const createClient = require('lightrpc').createClient;

var env = require('dotenv').config()
require('dotenv-expand')(env)

const client = createClient(process.env.API_URL || 'https://api.steemit.com');
client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

module.exports = client;
