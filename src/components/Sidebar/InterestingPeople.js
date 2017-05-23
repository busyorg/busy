import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Avatar from '../Avatar';
import Follow from '../Button/Follow';

const InterestingPeople = ({ users }) =>
  <div className="card rounded p-3 bg-white">
    <div>
      <h4>Interesting People</h4>
      <hr />
    </div>
    {users.map(user =>
      <div>
        <span className="mr-2">
          <Link to={`/${user.name}`}>
            <Avatar name={user.name} size="34" />
          </Link>
        </span>
        <Link to={`/${user.name}`}>
          <b>{user.name}</b>
        </Link>
        <span className="float-right">
          <Follow username={user.name} />
        </span>
        <div className="my-2">{user.about}</div>
        <hr />
      </div>
    )}
    <h5>
      Discover More People
    </h5>
  </div>;

InterestingPeople.propTypes = {
  users: PropTypes.map,
};

export default InterestingPeople;
