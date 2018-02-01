import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Tooltip } from 'antd';

const VoteActionMessage = ({ actionDetails, currentUsername }) => {
  const postLink = `/@${actionDetails.author}/${actionDetails.permlink}`;
  let voteType = 'unvoted';
  const voteWeight = (
    <FormattedNumber
      // eslint-disable-next-line react/style-prop-object
      style="percent"
      value={Math.abs(actionDetails.weight) / 10000}
      maximumFractionDigits={2}
    />
  );

  if (actionDetails.weight > 0) {
    voteType = 'upvoted';
  } else if (actionDetails.weight < 0) {
    voteType = 'downvoted';
  }

  return (
    <span>
      {currentUsername === actionDetails.voter ? (
        <span className="capitalize-text">
          <FormattedMessage id={voteType} defaultMessage={voteType} />
        </span>
      ) : (
        <FormattedMessage
          id={`user_${voteType}_post`}
          defaultMessage={`{username} ${voteType}`}
          values={{
            username: (
              <Link to={`/@${actionDetails.voter}`}>
                <span className="username">{actionDetails.voter}</span>
              </Link>
            ),
          }}
        />
      )}
      {actionDetails.weight === 0 ? (
        ' '
      ) : (
        <Tooltip title={<FormattedMessage id="voting_weight" defaultMessage="Vote Weight" />}>
          {' ('}
          {voteWeight}
          {') '}
        </Tooltip>
      )}
      <Link to={`/@${actionDetails.author}`}>
        <span className="username">{actionDetails.author}</span>
      </Link>
      {' ('}
      <Link to={postLink}>{actionDetails.permlink}</Link>
      {')'}
    </span>
  );
};

VoteActionMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
};

export default VoteActionMessage;
