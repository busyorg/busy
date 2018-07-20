import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import urlParse from 'url-parse';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import formatter from '../helpers/steemitFormatter';
import Avatar from '../components/Avatar';
import FollowButton from '../widgets/FollowButton';

const DiscoverUser = ({ user }) => {
  const parsedJSON = _.attempt(JSON.parse, user.json_metadata);
  const userJSON = _.isError(parsedJSON) ? {} : parsedJSON;
  const userProfile = _.has(userJSON, 'profile') ? userJSON.profile : {};
  const location = userProfile.location;
  const name = userProfile.name;
  const about = userProfile.about;
  const reputation = formatter.reputation(user.reputation);
  let website = userProfile.website;

  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }

  const url = urlParse(website);
  let hostWithoutWWW = url.host;

  if (hostWithoutWWW.indexOf('www.') === 0) {
    hostWithoutWWW = hostWithoutWWW.slice(4);
  }

  return (
    <div key={user.name} className="Discover__user">
      <div className="Discover__user__content">
        <div className="Discover__user__links">
          <Link to={`/@${user.name}`}>
            <Avatar username={user.name} size={40} />
          </Link>
          <div className="Discover__user__profile">
            <div className="Discover__user__profile__header">
              <Link to={`/@${user.name}`}>
                <span className="Discover__user__name">
                  <span className="username">{name || user.name}</span>
                </span>
              </Link>
              <Tag>{reputation}</Tag>
              <div className="Discover__user__follow">
                <FollowButton username={user.name} />
              </div>
            </div>
            <div className="Discover__user__location">
              {location && (
                <span>
                  <i className="iconfont icon-coordinates text-icon" />
                  {`${location} `}
                </span>
              )}
              {website && (
                <span>
                  <i className="iconfont icon-link text-icon" />
                  <a target="_blank" rel="noopener noreferrer" href={website}>
                    {`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`}
                  </a>
                </span>
              )}
            </div>
            <div className="Discover__user__about">{about}</div>
          </div>
        </div>
      </div>
      <div className="Discover__user__divider" />
    </div>
  );
};

DiscoverUser.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default DiscoverUser;
