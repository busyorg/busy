import { createClient } from 'lightrpc';

const options = {
  timeout: 15000,
};

const steemUrl = process.env.STEEMJS_URL || 'https://api.steemit.com';

const client = createClient(steemUrl, options);
client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

export default client;
