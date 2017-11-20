import _ from 'lodash';
import * as accountHistoryConstants from '../constants/accountHistory';

export const getVoteMessage = (intl, actionDetails) => {
  let voteType = 'unvoted';
  if (actionDetails.weight > 0) {
    voteType = 'upvoted';
  } else if (actionDetails.weight < 0) {
    voteType = 'downvoted';
  }
  return intl.formatMessage(
    {
      id: `user_${voteType}_post`,
      defaultMessage: `{username} ${voteType}`,
    },
    { username: actionDetails.voter },
  );
};

export const getCustomJSONMessage = (intl, actionDetails) => {
  const actionJSON = JSON.parse(actionDetails.json);
  const customActionType = actionJSON[0];
  const customActionDetails = actionJSON[1];
  if (customActionType === accountHistoryConstants.FOLLOW) {
    const followAction = _.isEmpty(customActionDetails.what) ? 'unfollowed' : 'followed';
    return intl.formatMessage(
      {
        id: `user_${followAction}`,
        defaultMessage: `{follower} ${followAction} {following}`,
      },
      {
        follower: customActionDetails.follower,
        following: customActionDetails.following,
      },
    );
  } else if (customActionType === accountHistoryConstants.REBLOG) {
    return intl.formatMessage(
      {
        id: 'user_reblogged_post',
        defaultMessage: '{username} reblogged {postLink}',
      },
      {
        username: customActionDetails.account,
        postLink: `@${customActionDetails.author}/${customActionDetails.permlink}`,
      },
    );
  }
  return '';
};

export const getMessageForActionType = (intl, currentUsername, actionType, actionDetails) => {
  switch (actionType) {
    case accountHistoryConstants.ACCOUNT_CREATE_WITH_DELEGATION:
      return intl.formatMessage(
        {
          id: 'account_created_with_delegation',
          defaultMessage: '{creator} created account with delegation {account}',
        },
        {
          creator: actionDetails.creator,
          account: actionDetails.new_account_name,
        },
      );
    case accountHistoryConstants.ACCOUNT_CREATE:
      return intl.formatMessage(
        {
          id: 'account_created',
          defaultMessage: '{creator} created account {account}',
        },
        {
          creator: actionDetails.creator,
          account: actionDetails.new_account_name,
        },
      );
    case accountHistoryConstants.VOTE:
      return getVoteMessage(intl, actionDetails);
    case accountHistoryConstants.COMMENT:
      return intl.formatMessage(
        {
          id: 'user_replied_to',
          defaultMessage: '{username} replied to {author} ({postLink})',
        },
        {
          username: actionDetails.author,
          author: _.isEmpty(actionDetails.parent_author)
            ? actionDetails.author
            : actionDetails.parent_author,
          postLink: _.isEmpty(actionDetails.parent_author)
            ? `${actionDetails.author}/${actionDetails.permlink}`
            : `${actionDetails.parent_author}/${actionDetails.parent_permlink}`,
        },
      );
    case accountHistoryConstants.CUSTOM_JSON:
      return getCustomJSONMessage(intl, actionDetails);
    case accountHistoryConstants.ACCOUNT_UPDATE:
      return intl.formatMessage({
        id: 'account_updated',
        defaultMessage: 'Account Updated',
      });
    case accountHistoryConstants.AUTHOR_REWARD:
      return intl.formatMessage(
        {
          id: 'author_reward_for_post',
          defaultMessage: 'Author Reward: {rewards} for {author} ({postLink})',
        },
        {
          rewards: 'SBD, STEEM, SP',
          author: actionDetails.author,
          postLink: actionDetails.permlink,
        },
      );
    case accountHistoryConstants.CURATION_REWARD:
      return intl.formatMessage(
        {
          id: 'curation_reward_for_post',
          defaultMessage: 'Curation Reward: {steemPower} SP for {author} ({postLink})',
        },
        {
          steemPower: 'SP',
          author: actionDetails.comment_author,
          postLink: actionDetails.comment_permlink,
        },
      );
    case accountHistoryConstants.ACCOUNT_WITNESS_VOTE:
      if (actionDetails.approve) {
        return intl.formatMessage(
          {
            id: 'account_approve_witness',
            defaultMessage: '{account} approve witness {witness}',
          },
          { account: actionDetails.account, witness: actionDetails.witness },
        );
      }
      return intl.formatMessage(
        {
          id: 'account_unapprove_witness',
          defaultMessage: '{account} unapprove witness {witness}',
        },
        {
          account: actionDetails.account,
          witness: actionDetails.witness,
        },
      );
    case accountHistoryConstants.TRANSFER:
      if (actionDetails.to === currentUsername) {
        return intl.formatMessage(
          {
            id: 'received_from',
            defaultMessage: 'Received from {username}',
          },
          {
            username: actionDetails.from,
          },
        );
      }
      return intl.formatMessage(
        {
          id: 'transferred_to',
          defaultMessage: 'Transferred to {username}',
        },
        {
          username: actionDetails.to,
        },
      );
    case accountHistoryConstants.TRANSFER_TO_VESTING:
      return intl.formatMessage({
        id: 'powered_up',
        defaultMessage: 'Powered up ',
      });
    case accountHistoryConstants.CLAIM_REWARD_BALANCE:
      return intl.formatMessage({
        id: 'claim_rewards',
        defaultMessage: 'Claim rewards',
      });
    case accountHistoryConstants.TRANSFER_TO_SAVINGS:
      return intl.formatMessage(
        {
          id: 'transfer_to_savings',
          defaultMessage: 'Transfer to savings {amount} to {username}',
        },
        {
          amount: actionDetails.amount || ' STEEM',
          username: actionDetails.to,
        },
      );
    case accountHistoryConstants.TRANSFER_FROM_SAVINGS:
      return intl.formatMessage(
        {
          id: 'transfer_from_savings',
          defaultMessage: 'Transfer from savings {amount} to {username}',
        },
        {
          amount: actionDetails.amount || ' STEEM',
          username: actionDetails.from,
        },
      );
    case accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS:
      return intl.formatMessage(
        {
          id: 'cancel_transfer_from_savings',
          defaultMessage: 'Cancel transfer from savings (request {requestId})',
        },
        {
          requestId: actionDetails.request_id,
        },
      );
    default:
      return '';
  }
};
