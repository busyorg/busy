import React from 'react';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import UserActivity from './UserActivity';
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
        <UserActivity isCurrentUser />
      </div>
    </div>
  </div>
);

export default Activity;
