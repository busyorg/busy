import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SocialLink from './SocialLink';

export const socialProfiles = [
  { id: 'website', icon: 'link', color: 'black', name: 'Website' },
  { id: 'facebook', icon: 'facebook', color: '#3b5998', name: 'Facebook' },
  { id: 'twitter', icon: 'twitter', color: '#00aced', name: 'Twitter' },
  { id: 'instagram', icon: 'instagram', color: '#8a3ab9', name: 'Instagram' },
  { id: 'github', icon: 'github', color: 'black', name: 'GitHub' },
  { id: 'bitcoin', icon: 'bitcoin', color: '#ff9900', name: 'Bitcoin' },
  { id: 'ethereum', icon: 'ethereum', color: '#3c3c3d', name: 'Ethereum' },
];

const SocialLinks = ({ profile }) => {
  const union = _.intersection(
    socialProfiles.map(socialProfile => socialProfile.id),
    Object.keys(profile),
  );

  const availableProfiles = socialProfiles.filter(
    socialProfile => union.indexOf(socialProfile.id) !== -1 && profile[socialProfile.id] !== '',
  );

  return (
    <div style={{ marginTop: 8 }}>
      {availableProfiles.map(socialProfile => (
        <SocialLink
          key={socialProfile.id}
          profile={socialProfile}
          url={profile[socialProfile.id]}
        />
      ))}
    </div>
  );
};

SocialLinks.propTypes = {
  profile: PropTypes.shape().isRequired,
};

export default SocialLinks;
