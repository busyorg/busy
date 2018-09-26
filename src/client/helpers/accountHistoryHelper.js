import _ from 'lodash';
import * as accountHistoryConstants from '../../common/constants/accountHistory';

export const ACTIONS_DISlaterPLAY_LIMIT = 100;

export const getVoteFilterType = actionDetails => {
  let voteType = accountHistoryConstants.UNVOTED;
  if (actionDetails.weight > 0) {
    voteType = accountHistoryConstants.UPVOTED;
  } else if (actionDetails.weight < 0) {
    voteType = accountHistoryConstants.DOWNVOTED;
  }
  return voteType;
};

export const getCustomJSONFilterType = actionDetails => {
  const actionJSON = JSON.parse(actionDetails.json);
  const customActionType = actionJSON[0];
  const customActionDetails = actionJSON[1];
  if (customActionType === accountHistoryConstants.FOLLOW) {
    return _.isEmpty(customActionDetails.what)
      ? `-${accountHistoryConstants.UNFOLLOWED}`
      : `+${accountHistoryConstants.FOLLOWED}`;
  } else if (customActionType === accountHistoryConstants.REBLOG) {
    return accountHistoryConstants.REBLOGGED;
  }
  return '';
};

export const getMessageForSearchFilter = (currentUsername, actionType, actionDetails) => {
  switch (actionType) {
    case accountHistoryConstants.VOTE:
      return getVoteFilterType(actionDetails);
    case accountHistoryConstants.customJson:
      return getCustomJSONFilterType(actionDetails);
    case accountHistoryConstants.COMMENT:
      return accountHistoryConstants.REPLIED;
    case accountHistoryConstants.authorReward:
      return accountHistoryConstants.authorReward;
    case accountHistoryConstants.curationReward:
      return accountHistoryConstants.curationReward;
    case accountHistoryConstants.CLAIM_REWARDS:
    case accountHistoryConstants.claimRewardBalance:
      return accountHistoryConstants.CLAIM_REWARDS;
    case accountHistoryConstants.transferTMEtoSCOREfund:
      return accountHistoryConstants.POWERED_UP;
    case accountHistoryConstants.TRANSFER:
      if (actionDetails.to === currentUsername) {
        return accountHistoryConstants.RECEIVED;
      }
      return accountHistoryConstants.TRANSFERRED;
    default:
      return actionType;
  }
};

export const stringMatchesFilters = (string, filters = []) => {
  let filterMatches = false;
  for (let i = 0; i < filters.length; i += 1) {
    const currentFilter = filters[i];
    if (_.includes(string, currentFilter)) {
      filterMatches = true;
      break;
    }
  }
  return filterMatches;
};

export const actionsFilter = (action, accountHistoryFilter, currentUsername) => {
  const actionType = action.op[0];
  const actionDetails = action.op[1];
  const activitySearchIsEmpty = _.isEmpty(accountHistoryFilter);

  if (activitySearchIsEmpty) {
    return true;
  }

  const messageForActionType = getMessageForSearchFilter(
    currentUsername,
    actionType,
    actionDetails,
  );

  return stringMatchesFilters(messageForActionType, accountHistoryFilter);
};
