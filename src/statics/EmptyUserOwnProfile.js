import React from 'react';
import { Link } from 'react-router';
import Icon from '../widgets/Icon';

const EmptyUserProfile = () => (
  <div className="ptl text-xs-center">
    <Icon name="info" xl />
    <h1>Your Profile is Empty!</h1>
    <p>
      You didn't publish any stories yet. <Link to="/write">Start now</Link>
    </p>
  </div>
);

export default EmptyUserProfile;
