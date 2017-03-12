import steem from 'steem';

steem.config.set(process.env.WS);

module.exports = steem.api;
