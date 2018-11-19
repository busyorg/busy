const createClient = require('weliterpcjs').createClient;

const client = createClient(process.env.API_URL, {timeout: 15000});
client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

module.exports = client;
