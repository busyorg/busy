import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as accountHistoryConstants from '../../common/constants/accountHistory';

const CustomJSONMessage = ({ actionDetails, currentUsername }) => {
  const actionJSON = JSON.parse(actionDetails.json);
  const customActionType = actionJSON[0];
  const customActionDetails = actionJSON[1];

  if (customActionType === accountHistoryConstants.FOLLOW) {
    const followAction = _.isEmpty(customActionDetails.what) ? 'unfollowed' : 'followed';

    if (currentUsername === customActionDetails.follower) {
      return (
        <span className="capitalize-text">
          <FormattedMessage
            id={`${followAction}_user`}
            defaultMessage={`${followAction} {following}`}
            values={{
              following: (
                <Link to={`/@${customActionDetails.following}`}>
                  {customActionDetails.following}
                </Link>
              ),
            }}
          />
        </span>
      );
    }

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
  } else if (customActionType === accountHistoryConstants.REBLOG) {
    return (
      <span className="capitalize-text">
        <FormattedMessage
          id="reblogged_post"
          defaultMessage="reblogged {postLink}"
          values={{
            postLink: (
              <Link to={`/@${customActionDetails.author}/${customActionDetails.permlink}`}>{`@${
                customActionDetails.author
              }/${customActionDetails.permlink}`}</Link>
            ),
          }}
        />
      </span>
    );
  }
  return null;
};

CustomJSONMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
};

export default CustomJSONMessage;
