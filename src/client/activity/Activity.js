import React from 'react';
import { FormattedMessage } from 'react-intl';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';

const Activity = () => (
  <div className="shifted">
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <Affix className="rightContainer" stickPosition={77}>
        <div className="right">
          <RightSidebar />
        </div>
      </Affix>
      <div className="center">
        <h1>
          <FormattedMessage id="activity" defaultMessage="Activity" />
        </h1>
      </div>
    </div>
  </div>
);

export default Activity;
