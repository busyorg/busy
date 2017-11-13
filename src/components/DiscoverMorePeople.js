import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getIsAuthenticated } from '../reducers';
import people from '../helpers/people';
import SignUp from './Sidebar/SignUp';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import User from './Sidebar/User';
import Affix from './Utils/Affix';
import './DiscoverMorePeople.less';

const DiscoverMorePeople = ({ authenticated }) => (
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
          <div className="DiscoverMorePeople__content">
            <div className="DiscoverMorePeople__title">
              <h1>
                <FormattedMessage id="discover_more_people" defaultMessage="Discover more people" />
              </h1>
              <FormattedMessage
                id="discover_more_people_info"
                defaultMessage="These people are the top contributors on Steem"
              />
            </div>
            {people.map(user => <User key={user} user={{ name: user }} />)}
          </div>
        </div>
      </div>
    </div>
  </div>
);

DiscoverMorePeople.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default connect(state => ({
  authenticated: getIsAuthenticated(state),
}))(DiscoverMorePeople);
