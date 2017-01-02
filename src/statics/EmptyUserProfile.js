import React from 'react';
import Icon from '../widgets/Icon';

const EmptyUserProfile = () => (
  <div className="ptl text-xs-center">
    <Icon name="info" xl />
    <h1>User Profile is Empty</h1>
    <p>
      This user doesn't have any story published yet!
    </p>
  </div>
);

export default EmptyUserProfile;
