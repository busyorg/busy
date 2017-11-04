import React from 'react';
import PropTypes from 'prop-types';
import steem from 'steem';
import _ from 'lodash';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import * as accountHistory from '../constants/accountHistory';

class UserActionMessage extends React.Component {
  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionDetails: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
  };

  renderVoteMessage() {
    const { actionDetails } = this.props;
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
  }

  renderCustomJSONMessage() {
    const { actionDetails } = this.props;
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
  }

  renderAccountUpdated() {
    const { actionDetails } = this.props;
    const accountUpdatedMessages = [];

    if (_.has(actionDetails, 'posting.account_auths')) {
      accountUpdatedMessages.push(
        <span key="authorized_apps">
          <FormattedMessage
            id="authorized_apps"
            defaultMessage="Authorized Apps: {apps}"
            values={{
              apps: _.reduce(
                actionDetails.posting.account_auths,
                (apps, authApp) => apps.concat(authApp[0]),
                [],
              ).join(', '),
            }}
          /><br />
        </span>,
      );
    }

    return (
      <div>
        <FormattedMessage id="account_updated" defaultMessage="Account updated" /><br />
        {accountUpdatedMessages}
      </div>
    );
  }

  renderFormattedMessage() {
    const { actionType, actionDetails, totalVestingShares, totalVestingFundSteem } = this.props;
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
        return this.renderVoteMessage();
      case accountHistory.COMMENT:
        return (
          <FormattedMessage
            id="user_replied_to"
            defaultMessage="{username} replied to {postLink}"
            values={{
              username: <Link to={`/@${actionDetails.author}`}>{actionDetails.author}</Link>,
              postLink: _.isEmpty(actionDetails.parent_author)
                ? <Link
                  to={`/p/@${actionDetails.author}/${actionDetails.permlink}`}
                >
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
        return this.renderCustomJSONMessage();
      case accountHistory.ACCOUNT_UPDATE:
        return this.renderAccountUpdated();
      case accountHistory.CURATION_REWARD:
        return (
          <FormattedMessage
            id="curation_reward_for_post"
            defaultMessage="Curation Reward: {steemPower} SP for {postLink}"
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
              postLink: (
                <Link
                  to={`/p/@${actionDetails.comment_author}/${actionDetails.comment_permlink}#@${actionDetails.comment_author}/${actionDetails.comment_permlink}`}
                >
                  {`${actionDetails.comment_author}/${actionDetails.comment_permlink}`}
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
