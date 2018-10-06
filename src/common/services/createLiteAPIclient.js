import { Client } from 'welitejs';

function createLiteAPIclient() {
  const client = new Client(process.env.WSS_API_URL);

  client.sendAsync = (message, params) =>
    new Promise((resolve, reject) => {
      client.call(message, params, (err, result) => {
        if (err !== null) return reject(err);
        return resolve(result);
      });
    });
  return client;
}

export default createLiteAPIclient;
