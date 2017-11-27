export const ACCOUNT_CREATE = 'account_create';
export const ACCOUNT_CREATE_WITH_DELEGATION = 'account_create_with_delegation';
export const VOTE = 'vote';
export const ACCOUNT_UPDATE = 'account_update';
export const COMMENT = 'comment';
export const DELETE_COMMENT = 'delete_comment';
export const CUSTOM_JSON = 'custom_json';
export const FOLLOW = 'follow';
export const REBLOG = 'reblog';
export const CURATION_REWARD = 'curation_reward';
export const AUTHOR_REWARD = 'author_reward';
export const ACCOUNT_WITNESS_VOTE = 'account_witness_vote';
export const FILL_VESTING_WITHDRAW = 'fill_vesting_withdraw';

// Wallet Action Types
export const TRANSFER = 'transfer';
export const TRANSFER_TO_VESTING = 'transfer_to_vesting';
export const CANCEL_TRANSFER_FROM_SAVINGS = 'cancel_transfer_from_savings';
export const TRANSFER_FROM_SAVINGS = 'transfer_from_savings';
export const TRANSFER_TO_SAVINGS = 'transfer_to_savings';
export const DELEGATE_VESTING_SHARES = 'delegate_vesting_shares';
export const CLAIM_REWARD_BALANCE = 'claim_reward_balance';

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
  ACCOUNT_CREATE,
  ACCOUNT_CREATE_WITH_DELEGATION,
  VOTE,
  COMMENT,
  CUSTOM_JSON,
  CURATION_REWARD,
  AUTHOR_REWARD,
  TRANSFER,
  TRANSFER_TO_VESTING,
  CANCEL_TRANSFER_FROM_SAVINGS,
  TRANSFER_FROM_SAVINGS,
  TRANSFER_TO_SAVINGS,
  DELEGATE_VESTING_SHARES,
  CLAIM_REWARD_BALANCE,
  ACCOUNT_WITNESS_VOTE,
  FILL_VESTING_WITHDRAW,
];
