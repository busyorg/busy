import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import User from './User';
import './InterestingPeople.less';

const InterestingPeople = ({ users, onRefresh }) => (
  <div className="InterestingPeople">
    <div className="InterestingPeople__container">
      <h4 className="InterestingPeople__title">
        <i className="iconfont icon-group InterestingPeople__icon" />
        {' '}
        <FormattedMessage id="interesting_people" defaultMessage="Interesting People" />
        <i
          role="presentation"
          onClick={onRefresh}
          className="iconfont icon-refresh InterestingPeople__icon-refresh"
        />
      </h4>
      <div className="InterestingPeople__divider" />
      {users &&
        users.map(user => (
          <User
            key={user.name}
            user={user}
          />
        ))}
      <h4 className="InterestingPeople__more">
        <Link to={'/discover'}>
          <FormattedMessage id="discover_more_people" defaultMessage="Discover More People" />
        </Link>
      </h4>
    </div>
  </div>
);

InterestingPeople.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
  onRefresh: PropTypes.func,
};

InterestingPeople.defaultProps = {
  users: [],
  onRefresh: () => {},
};

export default InterestingPeople;
