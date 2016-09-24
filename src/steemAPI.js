import { api } from 'steem';

api.setWebSocket('wss://this.piston.rocks');

module.exports = api;
