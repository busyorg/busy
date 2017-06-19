import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import numeral from 'numeral';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent
} from '../feed/feedActions';
import { getAccountWithFollowingCount } from './usersActions';
import { getUserComments, getMoreUserComments } from './userActions';
import MenuUser from '../app/Menu/MenuUser';
import { addUserFavorite, removeUserFavorite } from '../favorites/favoritesActions';
import FavoriteButton from '../favorites/FavoriteButton';
import Loading from '../widgets/Loading';
import Follow from '../widgets/Follow';
import Icon from '../widgets/Icon';
import Avatar from '../widgets/Avatar';
import { fetchChannelPresence } from '../messages/messagesActions';
import getChannelName from '../helpers/getChannelName';
import dispatchActions from '../helpers/dispatchActions';
import UserNotFound from '../statics/UserNotFound';
import Transfer from '../widgets/Transfer';
import { LeftSidebar, RightSidebar } from '../app/Sidebar/index';

export const needs = [getAccountWithFollowingCount];

@withRouter
@connect(
  state => ({
    auth: state.auth,
    feed: state.feed,
    posts: state.posts,
    comments: state.comments,
    favorites: state.favorites.users,
    users: state.users
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
        getAccountWithFollowingCount
      },
      dispatch
    )
)
@dispatchActions(
  {
    waitFor: state => state.auth && state.auth.isAuthenticated
  },
  (ownProps) => {
    const { auth, match } = ownProps;
    const channelName = getChannelName(auth, match.params.name);

    return {
      fetchChannelPresence: () => fetchChannelPresence(channelName)
    };
  }
)
export default class User extends React.Component {
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

  isFavorited() {
    const { favorites } = this.props;
    const username = this.props.match.params.name;
    return username && favorites.includes(username);
  }

  getUserView(user) {
    return user.name
      ? React.cloneElement(this.props.children, {
        ...this.props,
        user,
        limit: 10
      })
      : <UserNotFound />;
  }

  render() {
    const username = this.props.match.params.name;
    const { isFetching, ...user } = this.props.users[username] || {};
    const { profile = {} } = user.json_metadata || {};
    const busyHost = global.postOrigin || 'https://busy.org';
    const desc = profile.about || `Post by ${username}`;
    const image = `${process.env.STEEMCONNECT_IMG_HOST}/@${username}`;
    const canonicalUrl = `${busyHost}/@${username}`;
    const url = `${busyHost}/@${username}`;
    const title = `${profile.name || username} - Busy`;

    return (
      <div className="main-panel">
        <Helmet>
          <title>{title}</title>
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
        <div className="layout-container" style={{ marginTop: 21 }}>
          <div className="layout-row">
            <div className="layout-col layout-left layout-hidden-sm">
              <LeftSidebar auth={this.props.auth} />
            </div>
            <div className="layout-col layout-center">
              {isFetching ? <Loading /> : this.getUserView(user)}
            </div>
            <div className="layout-col layout-right layout-hidden-xs">
              <RightSidebar auth={this.props.auth} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
