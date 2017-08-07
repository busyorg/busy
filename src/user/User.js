import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent,
} from '../feed/feedActions';
import { getAccountWithFollowingCount } from './usersActions';
import { getUserComments, getMoreUserComments, followUser, unfollowUser } from './userActions';
import { addUserFavorite, removeUserFavorite } from '../favorites/favoritesActions';
import Loading from '../components/Icon/Loading';
import UserNotFound from '../statics/UserNotFound';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

export const needs = [getAccountWithFollowingCount];

@withRouter
@connect(
  state => ({
    auth: state.auth,
    feed: state.feed,
    posts: state.posts,
    comments: state.comments,
    favorites: state.favorites.users,
    users: state.users,
    followingList: state.user.following.list,
    pendingFollows: state.user.following.pendingFollows,
  }),
  dispatch =>
    bindActionCreators(
      {
        getFeedContent,
        getMoreFeedContent,
        getUserFeedContent,
        getMoreUserFeedContent,
        getUserComments,
        getMoreUserComments,
        addUserFavorite,
        removeUserFavorite,
        getAccountWithFollowingCount,
        followUser,
        unfollowUser,
      },
      dispatch,
    ),
)
export default class User extends React.Component {
  static propTypes = {
    auth: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    users: PropTypes.shape().isRequired,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingFollows: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.element.isRequired,
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
    const user = this.props.users[this.props.match.params.name] || {};
    if (user.name === undefined) {
      this.props.getAccountWithFollowingCount({ name: this.props.match.params.name });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.props.getAccountWithFollowingCount({ name: this.props.match.params.name });
    }
  }

  getUserView(user) {
    return user.name
      ? React.cloneElement(this.props.children, {
        ...this.props,
        user,
        limit: 10,
      })
      : <UserNotFound />;
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
    const { auth, followingList, pendingFollows } = this.props;
    const username = this.props.match.params.name;
    const { isFetching, ...user } = this.props.users[username] || {};
    const { profile = {} } = user.json_metadata || {};
    const busyHost = global.postOrigin || 'https://busy.org';
    const desc = profile.about || `Post by ${username}`;
    const image = `${process.env.STEEMCONNECT_IMG_HOST}/@${username}`;
    const canonicalUrl = `${busyHost}/@${username}`;
    const url = `${busyHost}/@${username}`;
    const displayedUsername = profile.name || username || '';
    const title = `${displayedUsername} - Busy`;

    const isSameUser = auth && auth.isAuthenticated && auth.user.name === username;

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
            auth={auth}
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
                <LeftSidebar auth={auth} user={user} />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={72}>
              <div className="right">
                <RightSidebar auth={this.props.auth} />
              </div>
            </Affix>
            <div className="center">
              {isFetching ? <Loading /> : this.getUserView(user)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
