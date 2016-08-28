var api = require('./../../node_modules/steem/lib/api');
api.setWebSocket('wss://this.piston.rocks');
module.exports = api;