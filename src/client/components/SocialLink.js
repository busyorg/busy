import React from 'react';
import PropTypes from 'prop-types';

const SocialLink = ({ profile, url }) => (
  <div>
    <i
      className={`iconfont text-icon icon-${profile.icon}`}
      style={{
        color: profile.color,
      }}
    />
    <a target="_blank" rel="noopener noreferrer" href={url}>
      {profile.name}
    </a>
  </div>
);

SocialLink.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  url: PropTypes.string,
};

SocialLink.defaultProps = {
  url: '',
};

export default SocialLink;
