import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as accountHistory from '../constants/accountHistory';

const CustomJSONMessage = ({ actionDetails }) => {
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

CustomJSONMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
};

export default CustomJSONMessage;
