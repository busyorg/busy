import { api } from 'steem';

api.setWebSocket(process.env.WS);

module.exports = api;
