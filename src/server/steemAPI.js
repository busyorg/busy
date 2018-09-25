const createClient = require('lightrpc').createClient;

const client = createClient(process.env.API_URL || 'https://node.weyoume.src');
client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

module.exports = client;
