import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedNumber } from 'react-intl';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';
import USDDisplay from './Utils/USDDisplay';
import './UserCard.less';

const UserCard = ({ username, voteUsd, votePercent }) => (
  <div className="UserCard">
    <div className="UserCard__left">
      <Link to={`/@${username}`}>
        <Avatar username={username} size={40} />
      </Link>
      <Link to={`/@${username}`}>{username}</Link>
      <span className="UserCard__alt">
        <span>
          <USDDisplay value={voteUsd} />
          <span className="ReactionsList__bullet" />
          <FormattedNumber
            style="percent" // eslint-disable-line react/style-prop-object
            value={votePercent}
          />
        </span>
      </span>
    </div>
    <FollowButton username={username} />
  </div>
);

UserCard.propTypes = {
  username: PropTypes.string.isRequired,
  voteUsd: PropTypes.number,
  votePercent: PropTypes.number,
};

UserCard.defaultProps = {
  voteUsd: 0.00,
  votePercent: 100,
};

export default UserCard;
