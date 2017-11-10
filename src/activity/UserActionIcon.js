import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as accountHistory from '../constants/accountHistory';
import Avatar from '../components/Avatar';

class UserActionIcon extends React.Component {
  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionDetails: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string.isRequired,
  };

  getIcon() {
    const { actionType, actionDetails, currentUsername } = this.props;
    switch (actionType) {
      case accountHistory.ACCOUNT_CREATE_WITH_DELEGATION:
      case accountHistory.ACCOUNT_CREATE:
        return 'icon-people_fill';
      case accountHistory.VOTE:
        if (currentUsername === actionDetails.voter) {
          if (actionDetails.weight > 0) {
            return 'icon-praise_fill';
          } else if (actionDetails.weight < 0) {
            return 'icon-praise_fill UserActivityActions__icon__dislike';
          }
          return 'icon-praise';
        }
        return null;
      case accountHistory.CUSTOM_JSON: {
        const actionJSON = JSON.parse(actionDetails.json);
        const customActionType = actionJSON[0];
        const customActionDetails = actionJSON[1];

        if (customActionType === accountHistory.REBLOG) {
          return 'icon-share1';
        } else if (
          customActionType === accountHistory.FOLLOW &&
          currentUsername === customActionDetails.follower
        ) {
          return _.isEmpty(customActionDetails.what) ? 'icon-addpeople' : 'icon-addpeople_fill';
        }

        return null;
      }
      case accountHistory.AUTHOR_REWARD:
      case accountHistory.CURATION_REWARD:
        return 'icon-ranking';
      default:
        return null;
    }
  }

  getAvatarUsername() {
    const { actionType, actionDetails } = this.props;
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
      case accountHistory.VOTE:
        return actionDetails.voter;
      case accountHistory.ACCOUNT_WITNESS_VOTE:
      case accountHistory.ACCOUNT_UPDATE:
        return actionDetails.account;
      default:
        return null;
    }
  }
  render() {
    const iconName = this.getIcon();
    const avatarUsername = this.getAvatarUsername();

    if (iconName) {
      return (
        <div className="UserActivityActions__icon__container">
          <i className={`iconfont ${iconName} UserActivityActions__icon`} />
        </div>
      );
    }

    return (
      <div className="UserActivityActions__avatar">
        <Avatar username={avatarUsername} size={40} />
      </div>
    );
  }
}

export default UserActionIcon;
