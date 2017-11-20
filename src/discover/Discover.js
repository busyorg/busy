import React from 'react';
import { FormattedMessage } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverContent from './DiscoverContent';
import Affix from '../components/Utils/Affix';
import './Discover.less';

const Discover = () => (
  <div>
    <div className="shifted">
      <div className="feed-layout container">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div className="Discover">
          <div className="Discover__title">
            <h1>
              <FormattedMessage id="discover_more_people" defaultMessage="Discover more people" />
            </h1>
            <FormattedMessage
              id="discover_more_people_info"
              defaultMessage="Discover the most reputable users of this platform"
            />
          </div>
          <div className="Discover__content">
            <DiscoverContent />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Discover;
