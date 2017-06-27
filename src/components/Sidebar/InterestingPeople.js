import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import User from './User';
import './InterestingPeople.less';

const InterestingPeople = ({ users }) => (
  <div className="InterestingPeople">
    <div className="InterestingPeople__container">
      <h4 className="InterestingPeople__title"><i className="iconfont icon-group InterestingPeople__icon" /> Interesting People</h4>
      <div className="InterestingPeople__divider" />
      {users && users.map(user =>
        <User key={user.name} user={user} />
      )}
      <h4 className="InterestingPeople__more">
        <Link to={'/latest-comments'}>
          Discover More People
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
