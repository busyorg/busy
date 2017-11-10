import React from 'react';
import PropTypes from 'prop-types';
import steem from 'steem';
import _ from 'lodash';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import * as accountHistory from '../constants/accountHistory';
import VoteActionMessage from './VoteActionMessage';
import CustomJSONMessage from './CustomJSONMessage';
import AuthorRewardMessage from './AuthorRewardMessage';

class UserActionMessage extends React.Component {
  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionDetails: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
  };

  renderFormattedMessage() {
    const {
      actionType,
      actionDetails,
      totalVestingShares,
      totalVestingFundSteem,
    } = this.props;

    switch (actionType) {
      case accountHistory.ACCOUNT_CREATE_WITH_DELEGATION:
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
      case accountHistory.ACCOUNT_CREATE:
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
      case accountHistory.VOTE:
        return <VoteActionMessage actionDetails={actionDetails} />;
      case accountHistory.COMMENT:
        return (
          <FormattedMessage
            id="user_replied_to"
            defaultMessage="{username} replied to {postLink}"
            values={{
              username: <Link to={`/@${actionDetails.author}`}>{actionDetails.author}</Link>,
              postLink: _.isEmpty(actionDetails.parent_author)
                ? <Link to={`/p/@${actionDetails.author}/${actionDetails.permlink}`}>
                  {`${actionDetails.author}/${actionDetails.permlink}`}
                </Link>
                : <Link
                  to={`/p/@${actionDetails.parent_author}/${actionDetails.parent_permlink}#@${actionDetails.author}/${actionDetails.permlink}`}
                >
                  {`${actionDetails.parent_author}/${actionDetails.parent_permlink}`}
                </Link>,
            }}
          />
        );
      case accountHistory.CUSTOM_JSON:
        return <CustomJSONMessage actionDetails={actionDetails} />;
      case accountHistory.ACCOUNT_UPDATE:
        return <FormattedMessage id="account_updated" defaultMessage="Account Updated" />;
      case accountHistory.AUTHOR_REWARD:
        return <AuthorRewardMessage actionDetails={actionDetails} />;
      case accountHistory.CURATION_REWARD:
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
              author: <Link to={`/@${actionDetails.comment_author}`}>
                {actionDetails.comment_author}
              </Link>,
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
      case accountHistory.ACCOUNT_WITNESS_VOTE:
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
