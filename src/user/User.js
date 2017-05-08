import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import numeral from 'numeral';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent,
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

@connect(
  state => ({
    auth: state.auth,
    feed: state.feed,
    posts: state.posts,
    comments: state.comments,
    favorites: state.favorites.users,
    users: state.users,
  }),
  dispatch => bindActionCreators({
    getFeedContent,
    getMoreFeedContent,
    getUserFeedContent,
    getMoreUserFeedContent,
    getUserComments,
    getMoreUserComments,
    addUserFavorite,
    removeUserFavorite,
    getAccountWithFollowingCount,
  }, dispatch)
)
@dispatchActions(
  {
    waitFor: state => state.auth && state.auth.isAuthenticated,
  },
  (ownProps) => {
    const { auth, params } = ownProps;
    const channelName = getChannelName(auth, params.name);

    return {
      fetchChannelPresence: () => fetchChannelPresence(channelName),
    };
  }
)
export default class User extends React.Component {
  static needs = [
    getAccountWithFollowingCount,
  ]

  componentWillMount() {
    const user = this.props.users[this.props.params.name] || {};
    if (user.name === undefined) {
      this.props.getAccountWithFollowingCount({ name: this.props.params.name });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.name !== this.props.params.name) {
      this.props.getAccountWithFollowingCount({ name: this.props.params.name });
    }
  }

  isFavorited() {
    const { favorites } = this.props;
    const username = this.props.params.name;
    return username && favorites.includes(username);
  }

  getUserView(user) {
    return user ? (<div>
      <MenuUser
        auth={this.props.auth}
        username={user.name}
      />
      <section
        className="align-center bg-green profile-header"
        style={{
          backgroundImage: `url(${process.env.STEEMCONNECT_IMG_HOST}/@${user.name}/cover)`,
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        <div className="my-5">
          <Avatar
            xl
            key={user.name}
            username={user.name}
            reputation={_.has(user, 'name') && user.reputation}
          />
          <h1>
            {_.has(user.json_metadata, 'profile.name')
              ? user.json_metadata.profile.name
              : user.name
            }
            {' '}
            <FavoriteButton
              isFavorited={this.isFavorited()}
              onClick={this.isFavorited()
                ? () => this.props.removeUserFavorite(user.name)
                : () => this.props.addUserFavorite(user.name)
              }
            />
          </h1>
          <Follow username={user.name} />
          <Transfer username={user.name} />
        </div>
      </section>
      <div className="profile">
        {_.has(user, 'name') && <div>
          <ul className="secondary-nav">
            <li>
              <Link to={`/@${user.name}`}>
                <Icon name="library_books" /> {numeral(user.post_count).format('0,0')}
                <span className="hidden-xs">
                  {' '}<FormattedMessage id="posts" defaultMessage="Posts" />
                </span>
              </Link>
            </li>
            <li>
              <Icon name="gavel" /> {numeral(parseInt(user.voting_power, 10) / 10000).format('%0')}
              <span className="hidden-xs">
                {' '}<FormattedMessage id="voting_power" defaultMessage="Voting Power" />
              </span>
            </li>
            <li>
              <Link to={`/@${user.name}/followers`}>
                <Icon name="people" /> {numeral(parseInt(user.follower_count, 10)).format('0,0')}
                <span className="hidden-xs">
                  {' '}<FormattedMessage id="followers" defaultMessage="Followers" />
                </span>
              </Link>
            </li>
            <li>
              <Link to={`/@${user.name}/followed`}>
                <Icon name="people" /> {numeral(parseInt(user.following_count, 10)).format('0,0')}
                <span className="hidden-xs">
                  {' '}<FormattedMessage id="followed" defaultMessage="Followed" />
                </span>
              </Link>
            </li>
          </ul>
        </div>}
      </div>
      <div>
        {React.cloneElement(
          this.props.children,
          {
            ...this.props,
            user,
            limit: 10,
          }
        )}
      </div>
    </div>) : <UserNotFound />;
  }

  render() {
    const username = this.props.params.name;
    const { isFetching, ...user } = this.props.users[username] || {};
    const busyHost = global.postOrigin || 'https://busy.org';
    const desc = `Post by ${username}`;
    const image = `${process.env.STEEMCONNECT_IMG_HOST}/@${username}`;
    const canonicalUrl = `${busyHost}/@${username}`;
    const url = `${busyHost}/@${username}`;
    const title = `${username} - Busy`;

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
          <meta property="twitter:image" content={image || 'https://steemit.com/images/steemit-twshare.png'} />
        </Helmet>
        {isFetching ? <Loading /> : this.getUserView(user)}
      </div>
    );
  }
}
