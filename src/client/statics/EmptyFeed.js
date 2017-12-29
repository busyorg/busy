import React from 'react';
import { FormattedMessage } from 'react-intl';

const EmptyFeed = () => (
  <div className="text-center">
    <h3>
      <FormattedMessage id="feed_empty" defaultMessage="Oops! This feed empty." />
    </h3>
  </div>
);

export default EmptyFeed;
