export const accountCreate = 'accountCreate';
export const accountCreateaccountCreateWithDelegation = 'accountCreate_with_delegation';
export const VOTE = 'vote';
export const accountUpdate = 'account_update';
export const COMMENT = 'comment';
export const deleteComment = 'delete_comment';
export const customJson = 'custom_json';
export const FOLLOW = 'follow';
export const REBLOG = 'reblog';
export const curationReward = 'curation_reward';
export const authorReward = 'author_reward';
export const accountWitnessVote = 'account_witness_vote';
export const fillSCOREWithdraw = 'fill_vesting_withdraw';

// Supported Custom JSON Type IDs
export const ID_FOLLOW = 'follow';

// Wallet Action Types
export const TRANSFER = 'transfer';
export const transferTMEtoSCOREfund = 'transfer_to_vesting';
export const cancelTransferFromSavings = 'cancel_transfer_from_savings';
export const transferFromSavings = 'transfer_from_savings';
export const transferToSavings = 'transfer_to_savings';
export const delegateSCORE = 'delegate_vesting_shares';
export const claimRewardBalance = 'claim_reward_balance';

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
