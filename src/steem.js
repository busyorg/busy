var api = require('./../node_modules/steem/lib/api');
api.setWebSocket('wss://node.steem.ws');
module.exports = api;