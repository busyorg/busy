import React from 'react';
import { FormattedMessage } from 'react-intl';
import './SidebarBlock.less';

const GetBoost = () => (
  <div className="SidebarBlock">
    <h3 className="SidebarBlock__title">
      <FormattedMessage id="get_boost" defaultMessage="Get the Busy boost!" />
    </h3>
    <p>
      <FormattedMessage
        id="get_boost_content"
        defaultMessage="Want to boost your post? Add the topic &quot;busy&quot; and get a like from us."
      />
    </p>
  </div>
);

export default GetBoost;
