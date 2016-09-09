var api = require('steem').api;
api.setWebSocket('wss://node.steem.ws');
module.exports = api;