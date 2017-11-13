import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getIsAuthenticated } from '../reducers';
import SignUp from '../components/Sidebar/SignUp';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverContent from './DiscoverContent';
import Affix from '../components/Utils/Affix';
import './Discover.less';

const Discover = ({ authenticated }) => (
  <div>
    <div className="shifted">
      <div className="feed-layout container">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <Affix className="rightContainer" stickPosition={77}>
          <div className="right">
            {!authenticated && <SignUp />}
          </div>
        </Affix>
        <div className="center">
          <div className="Discover__content">
            <div className="Discover__title">
              <h1>
                <FormattedMessage id="discover_more_people" defaultMessage="Discover more people" />
              </h1>
              <FormattedMessage
                id="discover_more_people_info"
                defaultMessage="These people are the top contributors on Steem"
              />
            </div>
            <DiscoverContent />
          </div>
        </div>
      </div>
    </div>
  </div>
);

Discover.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default connect(state => ({
  authenticated: getIsAuthenticated(state),
}))(Discover);
