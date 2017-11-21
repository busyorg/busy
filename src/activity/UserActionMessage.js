import React from 'react';
import PropTypes from 'prop-types';
import steem from 'steem';
import _ from 'lodash';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import * as accountHistoryConstants from '../constants/accountHistory';
import VoteActionMessage from './VoteActionMessage';
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
              creator: <Link to={`/@${actionDetails.creator}`}>{actionDetails.creator}</Link>,
              account: (
                <Link to={`/@${actionDetails.new_account_name}`}>
                  {actionDetails.new_account_name}
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
              creator: <Link to={`/@${actionDetails.creator}`}>{actionDetails.creator}</Link>,
              account: (
                <Link to={`/@${actionDetails.new_account_name}`}>
                  {actionDetails.new_account_name}
                </Link>
              ),
            }}
          />
        );
      case accountHistoryConstants.VOTE:
        return (
          <VoteActionMessage
            actionDetails={actionDetails}
            currentUsername={currentUsername}
          />
        );
      case accountHistoryConstants.COMMENT: {
        const author = _.isEmpty(actionDetails.parent_author)
          ? (<Link to={`/@${actionDetails.author}`}>
            {actionDetails.author}
          </Link>)
          : (<Link to={`/@${actionDetails.parent_author}`}>
            {actionDetails.parent_author}
          </Link>);
        const postLink = _.isEmpty(actionDetails.parent_author)
          ? (<Link to={`/p/@${actionDetails.author}/${actionDetails.permlink}`}>
            {actionDetails.permlink}
          </Link>)
          : (<Link
            to={`/p/@${actionDetails.parent_author}/${actionDetails.parent_permlink}#@${actionDetails.author}/${actionDetails.permlink}`}
          >
            {actionDetails.parent_permlink}
          </Link>);
        if (currentUsername === actionDetails.author) {
          return (
            <FormattedMessage
              id="replied_to"
              defaultMessage="Replied to {author} ({postLink})"
              values={{
                author,
                postLink,
              }}
            />
          );
        }
        return (
          <FormattedMessage
            id="user_replied_to"
            defaultMessage="{username} replied to {author} ({postLink})"
            values={{
              username: <Link to={`/@${actionDetails.author}`}>{actionDetails.author}</Link>,
              author,
              postLink,
            }}
          />
        );
      }
      case accountHistoryConstants.DELETE_COMMENT:
        return (
          <FormattedMessage
            id="deleted_comment"
            defaultMessage="Deleted comment ({link})"
            values={{
              link: (
                <Link to={`/p/@${actionDetails.author}/${actionDetails.permlink}`}>
                  {actionDetails.permlink}
                </Link>
              ),
            }}
          />
        );
      case accountHistoryConstants.CUSTOM_JSON:
        return (
          <CustomJSONMessage
            actionDetails={actionDetails}
            currentUsername={currentUsername}
          />
        );
      case accountHistoryConstants.ACCOUNT_UPDATE:
        return <FormattedMessage id="account_updated" defaultMessage="Account Updated" />;
      case accountHistoryConstants.AUTHOR_REWARD:
        return <AuthorRewardMessage actionDetails={actionDetails} />;
      case accountHistoryConstants.CURATION_REWARD:
        return (
          <FormattedMessage
            id="curation_reward_for_post"
            defaultMessage="Curation Reward: {steemPower} SP for {author} ({postLink})"
            values={{
              steemPower: (
                <FormattedNumber
                  value={parseFloat(
                    steem.formatter.vestToSteem(
                      actionDetails.reward,
                      totalVestingShares,
                      totalVestingFundSteem,
                    ),
                  )}
                />
              ),
              author: (
                <Link to={`/@${actionDetails.comment_author}`}>
                  {actionDetails.comment_author}
                </Link>
              ),
              postLink: (
                <Link
                  to={`/p/@${actionDetails.comment_author}/${actionDetails.comment_permlink}#@${actionDetails.comment_author}/${actionDetails.comment_permlink}`}
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
                    {actionDetails.account}
                  </Link>
                ),
                witness: (
                  <Link to={`/@${actionDetails.witness}`}>
                    {actionDetails.witness}
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
                  {actionDetails.account}
                </Link>
              ),
              witness: (
                <Link to={`/@${actionDetails.witness}`}>
                  {actionDetails.witness}
                </Link>
              ),
            }}
          />
        );
      default:
        return <FormattedMessage id={actionType} defaultMessage={actionType} />;
    }
  }
  render() {
    return (
      <div className="UserActivityActions__content__message">
        {this.renderFormattedMessage()}
      </div>
    );
  }
}

export default UserActionMessage;
