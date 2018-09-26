import { createClient } from 'lightrpc';

const options = {
  timeout: 15000,
};

const apiURL = process.env.API_URL || 'https://node.weyoume.src';

const client = createClient(apiURL, options);
client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

export default client;
