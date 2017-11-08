import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getIsFetchingFollowingList, getFollowingList } from '../reducers';
import people from '../helpers/people';
import Loading from './Icon/Loading';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import User from './Sidebar/User';
import Affix from './Utils/Affix';
import './DiscoverMorePeople.less';

const DiscoverMorePeople = ({ fetchingFollowingList, followingList }) => {
  const randomizedPeople = people
    .filter(p => !followingList.includes(p))
    .sort(() => 0.5 - Math.random())
    .slice(0, 50)
    .map(name => ({ name }));
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
          <div className="center">
            <h1>
              <span>
                <FormattedMessage id="discover_more_people" defaultMessage="Discover More People" />
              </span>
            </h1>
            <div className="DiscoverMorePeople">
              {fetchingFollowingList ? <Loading /> : content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DiscoverMorePeople.propTypes = {
  fetchingFollowingList: PropTypes.bool.isRequired,
  followingList: PropTypes.arrayOf(PropTypes.string),
};

DiscoverMorePeople.defaultProps = {
  followingList: [],
};

export default connect(state => ({
  fetchingFollowingList: getIsFetchingFollowingList(state),
  followingList: getFollowingList(state),
}))(DiscoverMorePeople);
