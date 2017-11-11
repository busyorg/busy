import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getIsFetchingFollowingList, getFollowingList, getIsAuthenticated } from '../reducers';
import people from '../helpers/people';
import Loading from './Icon/Loading';
import SignUp from './Sidebar/SignUp';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import User from './Sidebar/User';
import Affix from './Utils/Affix';
import './DiscoverMorePeople.less';

const DiscoverMorePeople = ({ fetchingFollowingList, followingList, authenticated }) => {
  const randomizedPeople = people.filter(p => !followingList.includes(p)).map(name => ({ name }));
  const content = randomizedPeople.length > 0
    ? randomizedPeople.map(user => <User key={user.name} user={user} />)
    : <FormattedMessage id="more_people_not_found" defaultMessage="No more people were found" />;

  return (
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
              <div className="SidebarBlock">
                <h3 className="SidebarBlock__title">
                  <FormattedMessage
                    id="discover_more_people_info"
                    defaultMessage="These people are the top contributors on Steem"
                  />
                </h3>
              </div>
            </div>
          </Affix>
          <div className="center">
            <h1 className="DiscoverMorePeople__title">
              <FormattedMessage id="discover_more_people" defaultMessage="Discover More People" />
            </h1>
            <div className="DiscoverMorePeople__content">
              {fetchingFollowingList ? <Loading /> : content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DiscoverMorePeople.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  fetchingFollowingList: PropTypes.bool.isRequired,
  followingList: PropTypes.arrayOf(PropTypes.string),
};

DiscoverMorePeople.defaultProps = {
  followingList: [],
};

export default connect(state => ({
  authenticated: getIsAuthenticated(state),
  fetchingFollowingList: getIsFetchingFollowingList(state),
  followingList: getFollowingList(state),
}))(DiscoverMorePeople);
