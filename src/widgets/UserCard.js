import React from 'react';
import { Link } from 'react-router';
import Avatar from '../widgets/Avatar';

export default ({ name, username, label }) =>
  <div className="col-12 col-sm-6 col-md-4 mb-4 text-center">
    <Link to={`/@${username}`}>
      <Avatar username={username} xl />
    </Link>
    <div className="mt-3">
      {name
        ? <div>
          <h3 className="mb-1">{name}</h3>
          <p className="text-info mb-1">@{username}</p>
        </div>
        : <h3 className="mb-1">{username}</h3>
      }
    </div>
    {label}
  </div>;
