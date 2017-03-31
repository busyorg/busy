import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import numeral from 'numeral';
import { Link } from 'react-router';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent,
} from '../feed/feedActions';
import { getAccountWithFollowingCount } from '../helpers/apiHelpers';
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
  }),
  dispatch => bindActionCreators({
    getFeedContent,
    getMoreFeedContent,
    getUserFeedContent,
    getMoreUserFeedContent,
    getUserComments,
    getMoreUserComments,
    addUserFavorite,
    removeUserFavorite
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
export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      fetching: false
    };
  }

  componentWillMount() {
    this.fetchUserData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.name !== this.props.params.name) {
      this.fetchUserData();
    }
  }

  fetchUserData() {
    this.setState({ user: {}, fetching: true });
    getAccountWithFollowingCount(this.props.params.name)
      .then(user => this.setState({ user }))
      .catch((e) => {
        if (e.message === 'User Not Found') {
          this.setState({ user: null });
        }
      }).finally(() => {
        this.setState({ fetching: false });
      });
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
    const { user, fetching } = this.state;
    return (
      <div className="main-panel">
        {fetching ? <Loading /> : this.getUserView(user)}
      </div>
    );
  }
}
