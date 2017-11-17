import React from 'react';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import WalletSidebar from '../components/Sidebar/WalletSidebar';
import UserWallet from '../user/UserWallet';

const Wallet = () => (
  <div className="shifted">
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <Affix className="rightContainer" stickPosition={77}>
        <div className="right">
          <WalletSidebar isCurrentUser />
        </div>
      </Affix>
      <div className="center">
        <UserWallet isCurrentUser />
      </div>
    </div>
  </div>
);

export default Wallet;
