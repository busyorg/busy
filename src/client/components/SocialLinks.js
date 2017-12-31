import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SocialLink from './SocialLink';
import socialProfiles, { transform } from '../helpers/socialProfiles';

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
