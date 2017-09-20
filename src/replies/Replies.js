import React from 'react';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';

const Replies = () => (
  <div className="shifted">
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={72}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <Affix className="rightContainer" stickPosition={72}>
        <div className="right">
          <RightSidebar />
        </div>
      </Affix>
      <div className="center">
        <h1>User replies</h1>
      </div>
    </div>
  </div>);

export default Replies;
