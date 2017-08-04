import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const EmptyFeed = () =>
  (<div className="text-center">
    <h3>
      <FormattedMessage
        id="@statics/empty_feed"
        defaultMessage="Oops! This feed empty, here's a link to the"
      />{' '}
      <Link to="/">
        <FormattedMessage id="@statics/homepage" defaultMessage="home page" />
      </Link>
      .
    </h3>
  </div>);

export default EmptyFeed;
