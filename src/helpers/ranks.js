export const getUserRank = (vestingShares) => {
  const vests = parseFloat(vestingShares, 10);
  let rank = 'Plankton';
  if (vests >= 1000000) {
    rank = 'Minnow';
  } else if (vests >= 10000000) {
    rank = 'Dolphin';
  } else if (vests >= 100000000) {
    rank = 'Orca';
  } else if (vests >= 1000000000) {
    rank = 'Whale';
  }
  return rank;
};

export default null;
