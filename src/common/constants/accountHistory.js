export const accountCreate = 'accountCreate';
export const accountCreateaccountCreateWithDelegation = 'accountCreateaccountCreateWithDelegation';
export const VOTE = 'vote';
export const accountUpdate = 'accountUpdate';
export const COMMENT = 'comment';
export const deleteComment = 'deleteComment';
export const customJson = 'customJson';
export const FOLLOW = 'follow';
export const REBLOG = 'reblog';
export const curationReward = 'curationReward';
export const authorReward = 'authorauthorReward_reward';
export const accountWitnessVote = 'accountWitnessVote';
export const fillSCOREWithdraw = 'fillSCOREWithdraw';

// Supported Custom JSON Type IDs
export const ID_FOLLOW = 'follow';

// Wallet Action Types
export const TRANSFER = 'transfer';
export const transferTMEtoSCOREfund = 'transferTMEtoSCOREfund';
export const cancelTransferFromSavings = 'cancelTransferFromSavings';
export const transferFromSavings = 'transferFromSavings';
export const transferToSavings = 'transferToSavings';
export const delegateSCORE = 'delegateSCORE';
export const claimRewardBalance = 'claimRewardBalance';

// Filter Types - General
export const DOWNVOTED = 'downvoted';
export const UPVOTED = 'upvoted';
export const UNVOTED = 'unvoted';
export const FOLLOWED = 'followed';
export const UNFOLLOWED = 'unfollowed';
export const REPLIED = 'replied';
export const REBLOGGED = 'reblogged';

// Filter Types - Finance
export const POWERED_UP = 'powered_up';
export const RECEIVED = 'received';
export const TRANSFERRED = 'transferred';
export const SAVINGS = 'savings';
export const CLAIM_REWARDS = 'claim_rewards';

export const PARSED_PROPERTIES = [
  accountCreate,
  accountCreateaccountCreateWithDelegation,
  VOTE,
  COMMENT,
  customJson,
  curationReward,
  authorReward,
  TRANSFER,
  transferTMEtoSCOREfund,
  cancelTransferFromSavings,
  transferFromSavings,
  transferToSavings,
  delegateSCORE,
  claimRewardBalance,
  accountWitnessVote,
  fillSCOREWithdraw,
];

export const PARSED_customJson_IDS = [ID_FOLLOW];
