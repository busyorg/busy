import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Tooltip } from 'antd';

const VoteActionMessage = ({ actionDetails }) => {
  const postLink = `@${actionDetails.author}/${actionDetails.permlink}`;
  let voteType = 'unvoted';
  let voteWeight = '';
  if (actionDetails.weight > 0) {
    voteType = 'upvoted';
    // eslint-disable-next-line react/style-prop-object
    voteWeight = <FormattedNumber style="percent" value={actionDetails.weight / 10000} />;
  } else if (actionDetails.weight < 0) {
    voteType = 'downvoted';
    // eslint-disable-next-line react/style-prop-object
    voteWeight = <FormattedNumber style="percent" value={Math.abs(actionDetails.weight) / 10000} />;
  }

  return (
    <span>
      <FormattedMessage
        id={`user_${voteType}_post`}
        defaultMessage={`{username} ${voteType}`}
        values={{
          username: <Link to={`/@${actionDetails.voter}`}>{actionDetails.voter}</Link>,
        }}
      />
      {actionDetails.weight === 0
        ? ' '
        : <Tooltip title={<FormattedMessage id="voting_weight" defaultMessage="Vote Weight" />}>
          {' ('}{voteWeight}{') '}
        </Tooltip>}
      <Link to={`/p/${postLink}`}>{postLink}</Link>
    </span>
  );
};

VoteActionMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
};

export default VoteActionMessage;
