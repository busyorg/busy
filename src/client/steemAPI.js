const { Client } = require('busyjs');

const client = new Client('wss://steemd.privex.io');

client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    client.call(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

export default client;
