import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import formatter from '../helpers/steemitFormatter';
import * as accountHistoryConstants from '../../common/constants/accountHistory';
import VoteActionMessage from './VoteActionMessage';
import CommentActionMessage from './CommentActionMessage';
import CustomJSONMessage from './CustomJSONMessage';
import AuthorRewardMessage from './AuthorRewardMessage';

class UserActionMessage extends React.Component {
  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionDetails: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    currentUsername: PropTypes.string.isRequired,
  };

  static renderDefault(actionType) {
    return <FormattedMessage id={actionType} defaultMessage={actionType} />;
  }

  renderFormattedMessage() {
    const {
      actionType,
      actionDetails,
      totalVestingShares,
      totalVestingFundSteem,
      currentUsername,
    } = this.props;

    switch (actionType) {
      case accountHistoryConstants.ACCOUNT_CREATE_WITH_DELEGATION:
        return (
          <FormattedMessage
            id="account_created_with_delegation"
            defaultMessage="{creator} created account with delegation {account}"
            values={{
              creator: (
                <Link to={`/@${actionDetails.creator}`}>
                  <span className="username">{actionDetails.creator}</span>
                </Link>
              ),
              account: (
                <Link to={`/@${actionDetails.new_account_name}`}>
                  <span className="username">{actionDetails.new_account_name}</span>
                </Link>
              ),
            }}
          />
        );
      case accountHistoryConstants.ACCOUNT_CREATE:
        return (
          <FormattedMessage
            id="account_created"
            defaultMessage="{creator} created account {account}"
            values={{
              creator: (
                <Link to={`/@${actionDetails.creator}`}>
                  <span className="username">{actionDetails.creator}</span>
                </Link>
              ),
              account: (
                <Link to={`/@${actionDetails.new_account_name}`}>
                  <span className="username">{actionDetails.new_account_name}</span>
                </Link>
              ),
            }}
          />
        );
      case accountHistoryConstants.VOTE:
        return (
          <VoteActionMessage actionDetails={actionDetails} currentUsername={currentUsername} />
        );
      case accountHistoryConstants.COMMENT:
        return (
          <CommentActionMessage actionDetails={actionDetails} currentUsername={currentUsername} />
        );
      case accountHistoryConstants.DELETE_COMMENT:
        return (
          <FormattedMessage
            id="deleted_comment"
            defaultMessage="Deleted comment ({link})"
            values={{
              link: (
                <Link to={`/@${actionDetails.author}/${actionDetails.permlink}`}>
                  {actionDetails.permlink}
                </Link>
              ),
            }}
          />
        );
      case accountHistoryConstants.CUSTOM_JSON:
        if (!_.includes(accountHistoryConstants.PARSED_CUSTOM_JSON_IDS, actionDetails.id)) {
          return UserActionMessage.renderDefault(actionType);
        }
        return <CustomJSONMessage actionDetails={actionDetails} />;
      case accountHistoryConstants.ACCOUNT_UPDATE:
        return <FormattedMessage id="account_updated" defaultMessage="Account Updated" />;
      case accountHistoryConstants.AUTHOR_REWARD:
        return (
          <AuthorRewardMessage
            actionDetails={actionDetails}
            totalVestingShares={totalVestingShares}
            totalVestingFundSteem={totalVestingFundSteem}
          />
        );
      case accountHistoryConstants.CURATION_REWARD:
        return (
          <FormattedMessage
            id="curation_reward_for_post"
            defaultMessage="Curation reward: {steemPower} SP for {author} ({postLink})"
            values={{
              steemPower: (
                <FormattedNumber
                  value={parseFloat(
                    formatter.vestToSteem(
                      actionDetails.reward,
                      totalVestingShares,
                      totalVestingFundSteem,
                    ),
                  )}
                />
              ),
              author: (
                <Link to={`/@${actionDetails.comment_author}`}>
                  <span className="username">{actionDetails.comment_author}</span>
                </Link>
              ),
              postLink: (
                <Link
                  to={`/p/@${actionDetails.comment_author}/${actionDetails.comment_permlink}#@${
                    actionDetails.comment_author
                  }/${actionDetails.comment_permlink}`}
                >
                  {actionDetails.comment_permlink}
                </Link>
              ),
            }}
          />
        );
      case accountHistoryConstants.ACCOUNT_WITNESS_VOTE:
        if (actionDetails.approve) {
          return (
            <FormattedMessage
              id="account_approve_witness"
              defaultMessage="{account} approve witness {witness}"
              values={{
                account: (
                  <Link to={`/@${actionDetails.account}`}>
                    <span className="username">{actionDetails.account}</span>
                  </Link>
                ),
                witness: (
                  <Link to={`/@${actionDetails.witness}`}>
                    <span className="username">{actionDetails.witness}</span>
                  </Link>
                ),
              }}
            />
          );
        }
        return (
          <FormattedMessage
            id="account_unapprove_witness"
            defaultMessage="{account} unapprove witness {witness}"
            values={{
              account: (
                <Link to={`/@${actionDetails.account}`}>
                  <span className="username">{actionDetails.account}</span>
                </Link>
              ),
              witness: (
                <Link to={`/@${actionDetails.witness}`}>
                  <span className="username">{actionDetails.witness}</span>
                </Link>
              ),
            }}
          />
        );
      case accountHistoryConstants.FILL_VESTING_WITHDRAW:
        return (
          <FormattedMessage
            id="power_down_message"
            defaultMessage="Started power down: {value}"
            values={{
              value: actionDetails.deposited,
            }}
          />
        );
      default:
        return UserActionMessage.renderDefault(actionType);
    }
  }
  render() {
    return (
      <div className="UserActivityActions__content__message">{this.renderFormattedMessage()}</div>
    );
  }
}

export default UserActionMessage;
