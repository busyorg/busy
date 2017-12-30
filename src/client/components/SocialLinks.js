import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SocialLink from './SocialLink';

export const socialProfiles = [
  { id: 'facebook', icon: 'facebook', color: '#3b5998', name: 'Facebook' },
  { id: 'twitter', icon: 'twitter', color: '#00aced', name: 'Twitter' },
  { id: 'instagram', icon: 'instagram', color: '#8a3ab9', name: 'Instagram' },
  { id: 'github', icon: 'github', color: 'black', name: 'GitHub' },
  { id: 'bitcoin', icon: 'bitcoin', color: '#ff9900', name: 'Bitcoin' },
  { id: 'ethereum', icon: 'ethereum', color: '#3c3c3d', name: 'Ethereum' },
];

export const socialTransformers = {
  facebook: id => `https://facebook.com/${id}`,
  twitter: id => `https://twitter.com/${id}`,
  instagram: id => `https://instagram.com/${id}`,
  github: id => `https://github.com/${id}`,
  bitcoin: id => `https://blockchain.info/address/${id}`,
  ethereum: id => `https://etherscan.io/address/${id}`,
};

const transform = (socialId, id) => socialTransformers[socialId](id);

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
          url={transform(socialProfile.id, profile[socialProfile.id])}
        />
      ))}
    </div>
  );
};

SocialLinks.propTypes = {
  profile: PropTypes.shape().isRequired,
};

export default SocialLinks;
