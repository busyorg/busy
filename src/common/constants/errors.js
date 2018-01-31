export default {
  POST_INTERVAL: {
    fingerprint: 'You may only post once every 5 minutes',
    message: 'You may only post once every 5 minutes.',
  },
  COMMENT_INTERVAL: {
    fingerprint: 'You may only comment once every 20 seconds.',
    message: 'You may only comment once every 20 seconds.',
  },
  DUPLICATE_VOTE: {
    fingerprint: 'You have already voted in a similar way',
    message: 'You have already voted in a similar way.',
  },
  DUPLICATE_REBLOG: {
    fingerprint: 'Account has already reblogged this post',
    message: 'You have already reblogged this post',
  },
  POST_TOO_BIG: {
    fingerprint: '<= (get_dynamic_global_properties().maximum_block_size - 256)',
    message: 'Your post is too big.',
  },
  BANDWIDTH_EXCEEDED: {
    fingerprint: 'bandwidth limit exceeded',
    message: 'Your bandwith has been exceeded. Please wait to transact or power up STEEM.',
  },
};
