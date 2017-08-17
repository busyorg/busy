import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getUser,
  getFollowingList,
  getPendingFollows,
} from '../reducers';

import { getAccountWithFollowingCount } from './usersActions';
import { followUser, unfollowUser } from './userActions';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

import UserProfile from './UserProfile';
import UserComments from './UserComments';
import UserFollowers from './UserFollowers';
import UserFollowing from './UserFollowing';
import UserReblogs from './UserReblogs';
import UserFeed from './UserFeed';
import UserTransfers from './UserTransfers';

export const needs = [getAccountWithFollowingCount];

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    user: getUser(state, ownProps.match.params.name),
    followingList: getFollowingList(state),
    pendingFollows: getPendingFollows(state),
  }),
  dispatch =>
    bindActionCreators(
      {
        getAccountWithFollowingCount,
        followUser,
        unfollowUser,
      },
      dispatch,
    ),
)
export default class User extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingFollows: PropTypes.arrayOf(PropTypes.string).isRequired,
    getAccountWithFollowingCount: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
  };

  static defaultProps = {
    getAccountWithFollowingCount: () => {},
    followUser: () => {},
    unfollowUser: () => {},
  };

  static needs = needs;

  componentWillMount() {
    if (!this.props.user.name) {
      this.props.getAccountWithFollowingCount({ name: this.props.match.params.name });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.props.getAccountWithFollowingCount({ name: this.props.match.params.name });
    }
  }

  handleFollowClick = () => {
    const username = this.props.match.params.name;
    const isFollowed = this.props.followingList.includes(username);
    if (isFollowed) {
      this.props.unfollowUser(username);
    } else {
      this.props.followUser(username);
    }
  };

  render() {
    const { authenticated, authenticatedUser, match, followingList, pendingFollows } = this.props;
    const username = this.props.match.params.name;
    const { isFetching, ...user } = this.props.user;
    const { profile = {} } = user.json_metadata || {};
    const busyHost = global.postOrigin || 'https://busy.org';
    const desc = profile.about || `Post by ${username}`;
    const image = `${process.env.STEEMCONNECT_IMG_HOST}/@${username}`;
    const canonicalUrl = `${busyHost}/@${username}`;
    const url = `${busyHost}/@${username}`;
    const displayedUsername = profile.name || username || '';
    const title = `${displayedUsername} - Busy`;

    const isSameUser = authenticated && authenticatedUser.name === username;

    const isFollowed = followingList.includes(username);
    const pendingFollow = pendingFollows.includes(username);

    return (
      <div className="main-panel">
        <Helmet>
          <title>
            {title}
          </title>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="description" content={desc} />

          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="Busy" />

          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@steemit'} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
          <meta
            property="twitter:image"
            content={image || 'https://steemit.com/images/steemit-twshare.png'}
          />
        </Helmet>
        <ScrollToTopOnMount />
        {user &&
          <UserHero
            authenticated={authenticated}
            user={user}
            username={displayedUsername}
            isSameUser={isSameUser}
            isFollowed={isFollowed}
            pendingFollow={pendingFollow}
            onFollowClick={this.handleFollowClick}
          />}
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={72}>
              <div className="left">
                <LeftSidebar user={user} />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={72}>
              <div className="right">
                <RightSidebar />
              </div>
            </Affix>
            <div className="center">
              <Route exact path={match.path} component={UserProfile} />
              <Route path={`${match.path}/comments`} component={UserComments} />
              <Route path={`${match.path}/followers`} component={UserFollowers} />
              <Route path={`${match.path}/followed`} component={UserFollowing} />
              <Route path={`${match.path}/reblogs`} component={UserReblogs} />
              <Route path={`${match.path}/feed`} component={UserFeed} />
              <Route path={`${match.path}/transfers`} component={UserTransfers} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
