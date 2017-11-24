import React from 'react';
import { FormattedMessage } from 'react-intl';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import requiresLogin from '../auth/requiresLogin';

const ProfileSettings = () => (
  <div className="shifted">
    <div className="settings-layout container">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <div className="center">
        <h1>
          <FormattedMessage id="edit_profile" defaultMessage="Edit Profile" />
        </h1>
      </div>
    </div>
  </div>
);

export default requiresLogin(ProfileSettings);
