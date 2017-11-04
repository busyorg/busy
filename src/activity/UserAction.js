import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { Tooltip } from 'antd';
import Avatar from '../components/Avatar';
import * as accountHistory from '../constants/accountHistory';

const getIcon = (actionType, actionDetails) => {
  switch (actionType) {
    case accountHistory.ACCOUNT_CREATE_WITH_DELEGATION:
    case accountHistory.ACCOUNT_CREATE:
      return 'icon-people_fill';
    case accountHistory.VOTE:
      if (actionDetails.weight > 0) {
        return 'icon-praise_fill';
      } else if (actionDetails.weight < 0) {
        return 'icon-praise_fill UserActivityActions__icon__dislike';
      }
      return 'icon-praise';
    case accountHistory.CUSTOM_JSON: {
      const actionJSON = JSON.parse(actionDetails.json);
      const customActionType = actionJSON[0];

      if (customActionType === accountHistory.REBLOG) {
        return 'icon-share1';
      }

      return null;
    }
    default:
      return null;
  }
};

const getAvatarUsername = (actionType, actionDetails) => {
  switch (actionType) {
    case accountHistory.COMMENT:
      return actionDetails.author;
    case accountHistory.CUSTOM_JSON: {
      const actionJSON = JSON.parse(actionDetails.json);
      const customActionType = actionJSON[0];
      const customActionDetails = actionJSON[1];

      if (customActionType === accountHistory.FOLLOW) {
        return customActionDetails.follower;
      }

      return null;
    }
    case accountHistory.ACCOUNT_UPDATE:
      return actionDetails.account;
    default:
      return null;
  }
};

const getVoteMessage = (actionDetails) => {
  const postLink = `@${actionDetails.author}/${actionDetails.permlink}`;
  let voteType = 'unvoted';
  if (actionDetails.weight > 0) {
    voteType = 'upvoted';
  } else if (actionDetails.weight < 0) {
    voteType = 'downvoted';
  }

  return (
    <FormattedMessage
      id={`user_${voteType}_post`}
      defaultMessage={`{username} ${voteType} {postLink}`}
      values={{
        username: <Link to={`/@${actionDetails.voter}`}>{actionDetails.voter}</Link>,
        postLink: <Link to={`/p/${postLink}`}>{postLink}</Link>,
      }}
    />
  );
};

const getCustomJSONMessage = (actionDetails) => {
  const actionJSON = JSON.parse(actionDetails.json);
  const customActionType = actionJSON[0];
  const customActionDetails = actionJSON[1];

  if (customActionType === accountHistory.FOLLOW) {
    const followAction = _.isEmpty(customActionDetails.what) ? 'unfollowed' : 'followed';
    return (
      <FormattedMessage
        id={`user_${followAction}`}
        defaultMessage={`{follower} ${followAction} {following}`}
        values={{
          follower: (
            <Link to={`/@${customActionDetails.follower}`}>{customActionDetails.follower}</Link>
          ),
          following: (
            <Link to={`/@${customActionDetails.following}`}>{customActionDetails.following}</Link>
          ),
        }}
      />
    );
  } else if (customActionType === accountHistory.REBLOG) {
    return (
      <FormattedMessage
        id="user_reblogged_post"
        defaultMessage="{username} reblogged {postLink}"
        values={{
          username: (
            <Link to={`/@${customActionDetails.account}`}>{customActionDetails.account}</Link>
          ),
          postLink: (
            <Link
              to={`/p/@${customActionDetails.author}/${customActionDetails.permlink}`}
            >{`@${customActionDetails.author}/${customActionDetails.permlink}`}</Link>
          ),
        }}
      />
    );
  }
  return null;
};

const getFormattedMessage = (actionType, actionDetails) => {
  switch (actionType) {
    case accountHistory.ACCOUNT_CREATE_WITH_DELEGATION:
    case accountHistory.ACCOUNT_CREATE:
      return <FormattedMessage id="account_created" defaultMessage="Account created" />;
    case accountHistory.VOTE:
      return getVoteMessage(actionDetails);
    case accountHistory.COMMENT:
      return (
        <FormattedMessage
          id="user_replied_to"
          defaultMessage="{username} replied to {postLink}"
          values={{
            username: <Link to={`/@${actionDetails.author}`}>{actionDetails.author}</Link>,
            postLink: (
              <Link
                to={`/p/@${actionDetails.parent_author}/${actionDetails.parent_permlink}#@${actionDetails.author}/${actionDetails.permlink}`}
              >
                {`${actionDetails.parent_author}/${actionDetails.parent_permlink}`}
              </Link>
            ),
          }}
        />
      );
    case accountHistory.CUSTOM_JSON:
      return getCustomJSONMessage(actionDetails);
    case accountHistory.ACCOUNT_UPDATE:
      return <FormattedMessage id="account_updated" defaultMessage="Account updated" />;
    default:
      return <FormattedMessage id={actionType} defaultMessage={actionType} />;
  }
};

const UserAction = ({ action }) => {
  const actionType = action.op[0];
  const actionDetails = action.op[1];
  const iconName = getIcon(actionType, actionDetails);
  const avatarUsername = getAvatarUsername(actionType, actionDetails);
  const message = getFormattedMessage(actionType, actionDetails);

  return (
    <div className="UserActivityActions__action">
      {iconName
        ? <div className="UserActivityActions__icon__container">
          <i className={`iconfont ${iconName} UserActivityActions__icon`} />
        </div>
        : <div className="UserActivityActions__avatar">
          <Avatar username={avatarUsername} size={40} />
        </div>}
      <div className="UserActivityActions__content">
        <div className="UserActivityActions__content__message">
          {message}
        </div>
        <span className="UserActivityActions__timestamp">
          <Tooltip
            title={
              <span>
                <FormattedDate value={`${action.timestamp}Z`} />{' '}
                <FormattedTime value={`${action.timestamp}Z`} />
              </span>
            }
          >
            <span>
              <FormattedRelative value={`${action.timestamp}Z`} />
            </span>
          </Tooltip>
        </span>
      </div>
    </div>
  );
};

UserAction.propTypes = {
  action: PropTypes.shape(),
};

UserAction.defaultProps = {
  action: {
    op: [],
  },
};

export default UserAction;
