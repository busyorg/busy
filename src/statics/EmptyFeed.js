import React from 'react';
import { Link } from 'react-router';

const EmptyFeed = () =>
  <div className="ptl text-center">
    <h3>
      Oops! This feed empty, here's a link to the <Link to="/">home page</Link>.
    </h3>
  </div>;

export default EmptyFeed;
