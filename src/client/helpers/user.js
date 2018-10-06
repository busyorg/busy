import { calculateVoteValue } from '../vendor/blockchainProtocolHelpers';

export const getUserRank = score => {
  let rank = 'Plankton';
  if (score >= 1000000000) {
    rank = 'Whale';
  } else if (score >= 100000000) {
    rank = 'Orca';
  } else if (score >= 10000000) {
    rank = 'Dolphin';
  } else if (score >= 1000000) {
    rank = 'Minnow';
  }
  return rank;
};

export const getUserRankKey = score => {
  let rank = 'plankton';
  if (score >= 1000000000) {
    rank = 'whale';
  } else if (score >= 100000000) {
    rank = 'orca';
  } else if (score >= 10000000) {
    rank = 'dolphin';
  } else if (score >= 1000000) {
    rank = 'minnow';
  }
  return `rank_${rank}`;
};

export const getTotalShares = user =>
  parseFloat(user.SCORE) +
  parseFloat(user.SCOREreceived) +
  -parseFloat(user.SCOREDelegated);

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
