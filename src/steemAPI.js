import steem from 'steem';

steem.config.set(process.env.WS);

export default steem.api;
