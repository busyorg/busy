import React from 'react';
import { Link } from 'react-router';

const EmptyUserProfile = () =>
  <div className="ptl text-xs-center">
    <h3>
      You didn't publish any stories yet. <Link to="/write">Start now</Link>
    </h3>
  </div>;

export default EmptyUserProfile;
