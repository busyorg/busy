import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as accountHistoryConstants from '../../common/constants/accountHistory';
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
      case accountHistoryConstants.accountCreateaccountCreateWithDelegation:
      case accountHistoryConstants.accountCreate:
        return 'icon-people_fill';
      case accountHistoryConstants.accountUpdate:
        return 'icon-businesscard_fill';
      case accountHistoryConstants.VOTE:
        if (currentUsername === actionDetails.voter) {
          if (actionDetails.weight > 0) {
            return 'icon-praise_fill';
          } else if (actionDetails.weight < 0) {
            return 'icon-praise_fill UserActivityActions__icon__dislike';
          }
          return 'icon-praise';
        }
        return null;
      case accountHistoryConstants.customJson: {
        const actionJSON = JSON.parse(actionDetails.json);
        const customActionType = actionJSON[0];
        const customActionDetails = actionJSON[1];

        if (!_.includes(accountHistoryConstants.PARSED_customJson_IDS, actionDetails.id)) {
          return 'icon-document';
        }
        if (
          customActionType === accountHistoryConstants.REBLOG &&
          currentUsername === customActionDetails.account
        ) {
          return 'icon-share1';
        } else if (
          customActionType === accountHistoryConstants.FOLLOW &&
          currentUsername === customActionDetails.follower
        ) {
          switch (customActionDetails.what[0]) {
            case 'ignore':
              return 'icon-delete_fill';
            case 'blog':
              return 'icon-addpeople_fill';
            default:
              return 'icon-addpeople';
          }
        }

        return null;
      }
      case accountHistoryConstants.authorReward:
      case accountHistoryConstants.curationReward:
        return 'icon-ranking';
      case accountHistoryConstants.COMMENT:
        if (actionDetails.parent_author === '') {
          return 'icon-brush_fill';
        }
        if (currentUsername === actionDetails.author) {
          return 'icon-message_fill';
        }
        return null;
      case accountHistoryConstants.deleteComment:
        return 'icon-message';
      case accountHistoryConstants.fillSCOREWithdraw:
        return 'icon-flashlight';
      default:
        return null;
    }
  }

  getAvatarUsername() {
    const { actionType, actionDetails } = this.props;
    switch (actionType) {
      case accountHistoryConstants.COMMENT:
        return actionDetails.author;
      case accountHistoryConstants.customJson: {
        const actionJSON = JSON.parse(actionDetails.json);
        const customActionType = actionJSON[0];
        const customActionDetails = actionJSON[1];

        if (customActionType === accountHistoryConstants.REBLOG) {
          return customActionDetails.account;
        } else if (customActionType === accountHistoryConstants.FOLLOW) {
          return customActionDetails.follower;
        }

        return null;
      }
      case accountHistoryConstants.VOTE:
        return actionDetails.voter;
      case accountHistoryConstants.accountWitnessVote:
      case accountHistoryConstants.accountUpdate:
        return actionDetails.account;
      default:
        return _.get(actionDetails, 'author', '');
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
