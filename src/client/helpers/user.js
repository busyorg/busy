import { calculateVoteValue } from '../vendor/steemitHelpers';

export const getUserRank = vests => {
  let rank = 'Plankton';
  if (vests >= 1000000000) {
    rank = 'Whale';
  } else if (vests >= 100000000) {
    rank = 'Orca';
  } else if (vests >= 10000000) {
    rank = 'Dolphin';
  } else if (vests >= 1000000) {
    rank = 'Minnow';
  }
  return rank;
};

export const getUserRankKey = vests => {
  let rank = 'plankton';
  if (vests >= 1000000000) {
    rank = 'whale';
  } else if (vests >= 100000000) {
    rank = 'orca';
  } else if (vests >= 10000000) {
    rank = 'dolphin';
  } else if (vests >= 1000000) {
    rank = 'minnow';
  }
  return `rank_${rank}`;
};

export const getTotalShares = user =>
  parseFloat(user.vesting_shares) +
  parseFloat(user.received_vesting_shares) +
  -parseFloat(user.delegated_vesting_shares);

export const getHasDefaultSlider = user => getTotalShares(user) >= 10000000;

export const getVoteValue = (user, recentClaims, rewardBalance, rate, weight = 10000) =>
  calculateVoteValue(
    getTotalShares(user),
    parseFloat(recentClaims),
    parseFloat(rewardBalance),
    rate,
    user.voting_power,
    weight,
  );

export default null;
