import React from 'react';
import { FormattedMessage } from 'react-intl';
import './StoryDeleted.less';

const StoryDeleted = () => (
  <div className="StoryDeleted">
    <h3>
      <FormattedMessage id="post_deleted" defaultMessage="This post has been deleted" />
    </h3>
  </div>
);

export default StoryDeleted;
