import base58 from 'bs58';
import getSlug from 'speakingurl';
import secureRandom from 'secure-random';
import diff_match_patch from 'diff-match-patch';
import steemAPI from '../steemAPI';
import formatter from '../helpers/steemitFormatter';
import _ from 'lodash';
import {
  HF21_TIME,
  DEFAULT_CURATION_REWARD_PERCENT,
  HF21_CURATION_REWARD_PERCENT,
} from '../helpers/constants';

const dmp = new diff_match_patch();
/**
 * This function is extracted from steemit.com source code and does the same tasks with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 * https://github.com/steemit/steemit.com/blob/edac65e307bffc23f763ed91cebcb4499223b356/app/redux/TransactionSaga.js#L340
 *
 */
export const createCommentPermlink = (parentAuthor, parentPermlink) => {
  let permlink;

  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  const newParentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parentAuthor}-${newParentPermlink}-${timeStr}`;

  if (permlink.length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
};

/**
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/utils/ParsersAndFormatters.js
 */
export function parsePayoutAmount(amount) {
  return parseFloat(String(amount).replace(/\s[A-Z]*$/, ''));
}

/**
 * Calculates Payout Details Modified as needed
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/components/elements/Voting.jsx
 */
export const calculatePayout = post => {
  const payoutDetails = {};
  const { active_votes, parent_author, cashout_time, last_payout } = post;

  const max_payout = parsePayoutAmount(post.max_accepted_payout);
  const pending_payout = parsePayoutAmount(post.pending_payout_value);
  const promoted = parsePayoutAmount(post.promoted);
  const total_author_payout = parsePayoutAmount(post.total_payout_value);
  const total_curator_payout = parsePayoutAmount(post.curator_payout_value);
  const is_comment = parent_author !== '';

  let payout = pending_payout + total_author_payout + total_curator_payout;
  if (payout < 0.0) payout = 0.0;
  if (payout > max_payout) payout = max_payout;
  payoutDetails.payoutLimitHit = payout >= max_payout;

  // There is an "active cashout" if: (a) there is a pending payout, OR (b)
  // there is a valid cashout_time AND it's NOT a comment with 0 votes.
  const cashout_active =
    pending_payout > 0 ||
    (cashout_time.indexOf('1969') !== 0 && !(is_comment && active_votes.length === 0));

  if (cashout_active) {
    payoutDetails.potentialPayout = pending_payout;
  }

  if (promoted > 0) {
    payoutDetails.promotionCost = promoted;
  }

  if (cashout_active) {
    // Append ".000Z" to make it ISO format (YYYY-MM-DDTHH:mm:ss.sssZ).
    payoutDetails.cashoutInTime = cashout_time + '.000Z';
  }

  if (max_payout === 0) {
    payoutDetails.isPayoutDeclined = true;
  } else if (max_payout < 1000000) {
    payoutDetails.maxAcceptedPayout = max_payout;
  }

  // payout should be used instead of total_author_payout for 100% beneficiary case (e.g., @finex)
  if (payout > 0) {
    // this is not actual total past payout. use totalPastPayouts below.
    //payoutDetails.pastPayouts = total_author_payout + total_curator_payout;
    payoutDetails.authorPayouts = total_author_payout;
    payoutDetails.curatorPayouts = total_curator_payout;
  }

  // if beneficiaries is set, estimate totalPostPayouts based on author:curator ratio
  const beneficiaries = _.get(post, 'beneficiaries', []);
  if (_.isEmpty(beneficiaries)) {
    payoutDetails.beneficiariesPayouts = 0;
    payoutDetails.totalPastPayouts = total_author_payout + total_curator_payout;
  } else {
    // HF21 50:50 was applied based on last_payout (not created)
    const curationRewardPercent =
      last_payout < HF21_TIME ? DEFAULT_CURATION_REWARD_PERCENT : HF21_CURATION_REWARD_PERCENT;

    // 100% = 1
    const total_beneficiaries_ratio =
      _.reduce(
        beneficiaries,
        (total, current) => {
          return total + current.weight;
        },
        0,
      ) / 10000;

    // beneficiariesPayouts estimation
    // Improved: exact value when total_beneficiaries_ratio < 1. Estimate as follows otherwise.
    // - curatorPayouts multiplied by author:curator ratio (e.g., (100-25)/25=3 before HF21)
    // - and then multiplied by total beneficiaries ratio (e.g., if 50%, half of the above amount is beneficiariesPayouts and the other half is authorPayouts)
    if (total_beneficiaries_ratio < 1) {
      payoutDetails.beneficiariesPayouts =
        total_beneficiaries_ratio / (1 - total_beneficiaries_ratio) * total_author_payout;
    } else {
      payoutDetails.beneficiariesPayouts =
        total_curator_payout *
        (100 - curationRewardPercent) /
        curationRewardPercent *
        total_beneficiaries_ratio;
    }

    payoutDetails.totalPastPayouts =
      total_author_payout + total_curator_payout + payoutDetails.beneficiariesPayouts;
  }

  return payoutDetails;
};

function checkPermLinkLength(permlink) {
  if (permlink.length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
}

function slug(text) {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 });
}

/**
 * Generate permlink
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js
 */

export function createPermlink(title, author, parent_author, parent_permlink) {
  let permlink;
  if (title && title.trim() !== '') {
    let s = slug(title);
    if (s === '') {
      s = base58.encode(secureRandom.randomBuffer(4));
    }

    return steemAPI
      .sendAsync('get_content', [author, s])
      .then(content => {
        let prefix;
        if (content.body !== '') {
          // make sure slug is unique
          prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
        } else {
          prefix = '';
        }
        permlink = prefix + s;
        return checkPermLinkLength(permlink);
      })
      .catch(err => {
        console.warn('Error while getting content', err);
        return permlink;
      });
  }
  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  parent_permlink = parent_permlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parent_author}-${parent_permlink}-${timeStr}`;
  return Promise.resolve(checkPermLinkLength(permlink));
}

/**
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js#L412
 */
function createPatch(text1, text2) {
  if (!text1 && text1 === '') return undefined;
  const patches = dmp.patch_make(text1, text2);
  const patch = dmp.patch_toText(patches);
  return patch;
}

/**
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js#L329
 */
export function getBodyPatchIfSmaller(originalBody, body) {
  if (!originalBody) return body;
  const patch = createPatch(originalBody, body);
  // Putting body into buffer will expand Unicode characters into their true length
  if (patch && patch.length < new Buffer(body, 'utf-8').length) {
    body = patch;
  }
  return body;
}

/**
 * https://github.com/aaroncox/chainbb/blob/fcb09bee716e907c789a6494975093361482fb4f/services/frontend/src/components/elements/post/button/vote/options.js#L69
 */
export const calculateVoteValue = (
  vests,
  recentClaims,
  rewardBalance,
  rate,
  vp = 10000,
  weight = 10000,
) => {
  const vestingShares = parseInt(vests * 1e6, 10);
  const power = vp * weight / 10000 / 50;
  const rshares = power * vestingShares / 10000;
  return rshares / recentClaims * rewardBalance * rate;
};

export const calculateTotalDelegatedSP = (user, totalVestingShares, totalVestingFundSteem) => {
  const receivedSP = parseFloat(
    formatter.vestToSteem(user.received_vesting_shares, totalVestingShares, totalVestingFundSteem),
  );
  const delegatedSP = parseFloat(
    formatter.vestToSteem(user.delegated_vesting_shares, totalVestingShares, totalVestingFundSteem),
  );
  return receivedSP - delegatedSP;
};

export const calculatePendingWithdrawalSP = (user, totalVestingShares, totalVestingFundSteem) => {
  return parseFloat(
    formatter.vestToSteem(
      Math.min(
        parseFloat(user.vesting_withdraw_rate),
        (parseFloat(user.to_withdraw) - parseFloat(user.withdrawn)) / 100000,
      ),
      totalVestingShares,
      totalVestingFundSteem,
    ),
  );
};

export const calculateVotingPower = user => {
  const secondsago = (new Date().getTime() - new Date(user.last_vote_time + 'Z').getTime()) / 1000;
  return Math.min(10000, user.voting_power + 10000 * secondsago / 432000) / 10000;
};

export const calculateEstAccountValue = (
  user,
  totalVestingShares,
  totalVestingFundSteem,
  steemRate,
  sbdRate,
) => {
  const steemPower = formatter.vestToSteem(
    user.vesting_shares,
    totalVestingShares,
    totalVestingFundSteem,
  );
  return (
    parseFloat(steemRate) * (parseFloat(user.balance) + parseFloat(steemPower)) +
    parseFloat(user.sbd_balance) * parseFloat(sbdRate)
  );
};
