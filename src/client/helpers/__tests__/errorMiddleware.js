import { parseBlockChainError } from '../errorMiddleware';

describe('parseBlockChainError', () => {
  it('should fingerprint errors', () => {
    let actual = parseBlockChainError(
      '( now - auth.last_root_post ) > STEEM_MIN_ROOT_COMMENT_INTERVAL: You may only post once every 5 minutes.',
    );
    let expected = 'You may only post once every 5 minutes.';
    expect(actual).toEqual(expected);

    actual = parseBlockChainError(
      '(now - auth.last_post) > STEEM_MIN_REPLY_INTERVAL: You may only comment once every 20 seconds.',
    );
    expected = 'You may only comment once every 20 seconds.';
    expect(actual).toEqual(expected);

    actual = parseBlockChainError(
      'vote.vote_percent != o.weight: You have already voted in a similar way.',
    );
    expected = 'You have already voted in a similar way.';
    expect(actual).toEqual(expected);

    actual = parseBlockChainError(
      'blog_itr == blog_comment_idx.end(): Account has already reblogged this post',
    );
    expected = 'You have already reblogged this post.';
    expect(actual).toEqual(expected);

    actual = parseBlockChainError(
      '10 assert_exception: Assert Exception\nfc::raw::pack_size(trx) <= (get_dynamic_global_properties().maximum_block_size - 256): \n {}\n th_a database.cpp:642 push_transaction',
    );
    expected = 'Your post is too big.';
    expect(actual).toEqual(expected);

    actual = parseBlockChainError(
      'Account: account bandwidth limit exceeded. Please wait to transact or power up STEEM.',
    );
    expected = 'Your bandwith has been exceeded. Please wait to transact or power up STEEM.';
    expect(actual).toEqual(expected);

    actual = parseBlockChainError(
      'info->abs_rshares > STEEM_VOTE_DUST_THRESHOLD || vote_weight == 0: Voting weight is too small, please accumulate more voting power or steem power.',
    );
    expected =
      'Your voting power is too small, please accumulate more voting power or steem power.';
    expect(actual).toEqual(expected);
  });

  it('should extract message from unknown error', () => {
    expect(parseBlockChainError('assert 122 < 2: This is some error.')).toEqual(
      'This is some error.',
    );
  });

  it('should return unknown error when error is in wrong format', () => {
    expect(parseBlockChainError('this is not good')).toEqual('Unknown error.');
  });
});
