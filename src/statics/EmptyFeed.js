import React from 'react';
import { Link } from 'react-router';
import Icon from '../widgets/Icon';

const EmptyFeed = () => (
  <div className="ptl text-xs-center">
    <Icon name="info" xl />
    <h1>Empty Feed</h1>
    <p>
      This feed is still empty, please try another feed from the menu or <Link to="/">home page</Link>
    </p>
  </div>
);

export default EmptyFeed;
