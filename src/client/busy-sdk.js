const BUSY_URL = 'https://busy.org';

function createClient(target, acceptedOrigins = [BUSY_URL]) {
  const client = {
    target,
    nextId: 1,
    resolvers: {},
    rejectors: {},
    postMessage: message => {
      if (target) target.postMessage(message, '*');
    },
    call: (method, params) => {
      const id = client.nextId + 1;

      client.postMessage({
        jsonrpc: '2.0',
        id,
        method,
        params,
      });

      return new Promise((resolve, reject) => {
        client.resolvers[id] = resolve;
        client.rejectors[id] = reject;
      });
    },
    receive: (id, result, error) => {
      if (typeof id === 'undefined') return null;

      console.log('receive - busy SDK', { id, result, error });

      if (error) return client.rejectors[id](error);

      return client.resolvers[id](result);
    },
    receiveMessage: message => {
      const { id, result, error } = message;
      console.log('receive message', { id, result, error });
      client.receive(id, result || null, error || null);
    },
    handleMessage: e => {
      console.log('handle message', acceptedOrigins.indexOf(e.origin) === -1, { data: e.data });
      if (acceptedOrigins.indexOf(e.origin) === -1) return;
      if (e.data) {
        console.log('SUCCESS MESSAGE', { data: e.data });
        client.receiveMessage(e.data);
      } else {
        console.log('FAILED MESSAGE NO DATA');
      }
    },
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('message', client.handleMessage);
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('message', client.handleMessage);
  }

  return client;
}

export default createClient;
