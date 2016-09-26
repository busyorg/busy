import { api } from 'steem';

api.setWebSocket('wss://node.steem.ws');

module.exports = api;
