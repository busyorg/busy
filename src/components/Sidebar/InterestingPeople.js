import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import User from './User';
import './InterestingPeople.less';

const InterestingPeople = ({ users }) =>
  (<div className="InterestingPeople">
    <div className="InterestingPeople__container">
      <h4 className="InterestingPeople__title">
        <i className="iconfont icon-group InterestingPeople__icon" />
        {' '}
        <FormattedMessage id="interesting_people" />
      </h4>
      <div className="InterestingPeople__divider" />
      {users && users.map(user => <User key={user.name} user={user} />)}
      <h4 className="InterestingPeople__more">
        <Link to={'/latest-comments'}>
          <FormattedMessage id="discover_more_people" />
        </Link>
      </h4>
    </div>
  </div>);

InterestingPeople.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()),
};

InterestingPeople.defaultProps = {
  users: [],
};

export default InterestingPeople;
