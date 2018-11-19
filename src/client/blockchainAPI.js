import { createClient } from 'weliterpcjs';

const client = createClient(process.env.API_URL, {timeout: 15000});

if(typeof window !== 'undefined'){
	window.blockchainClient = client
}
client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
			// console.error('err', err)
      if (err !== null) {	return reject(err);	}
      return resolve(result);
    });
  });

export default client;
