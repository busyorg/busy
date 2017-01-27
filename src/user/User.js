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
import Header from '../app/Header';
import MenuUser from '../app/Menu/MenuUser';
import { addUserFavorite, removeUserFavorite } from '../favorites/favoritesActions';
import FavoriteButton from '../favorites/FavoriteButton';
import Loading from '../widgets/Loading';
import Follow from '../widgets/Follow';
import Icon from '../widgets/Icon';
import Avatar from '../widgets/Avatar';

@connect(
  state => ({
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
export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
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
    this.setState({ user: {} });
    getAccountWithFollowingCount(this.props.params.name)
      .then(user => this.setState({ user }));
  }

  isFavorited() {
    const { favorites } = this.props;
    const username = this.props.params.name;
    return username && favorites.includes(username);
  }

  render() {
    const username = this.props.params.name;
    const user = this.state.user;
    let jsonMetadata = {};
    try { jsonMetadata = JSON.parse(user.json_metadata); } catch (e) { jsonMetadata = {}; }

    return (
      <div className="main-panel">
        <Header />
        <MenuUser username={this.props.params.name} />
        <section
          className="align-center bg-green profile-header"
          style={{
            backgroundImage: `url(${process.env.STEEMCONNECT_IMG_HOST}/@${username}/cover)`,
            backgroundSize: 'cover',
            position: 'relative',
          }}
        >
          <div className="my-5">
            <Avatar xl username={username} reputation={_.has(user, 'name') && user.reputation} />
            <h1>
              {_.has(jsonMetadata, 'profile.name')
                ? jsonMetadata.profile.name
                : username
              }
              {' '}
              <FavoriteButton
                isFavorited={this.isFavorited()}
                onClick={this.isFavorited()
                  ? () => this.props.removeUserFavorite(username)
                  : () => this.props.addUserFavorite(username)
                }
              />
            </h1>
            <Follow username={username} />
          </div>
        </section>
        <div className="profile">
          {!_.has(user, 'name') && <Loading />}
          {_.has(user, 'name') && <div>
            <ul className="secondary-nav">
              <li>
                <Link to={`/@${username}`}>
                  <Icon name="library_books" /> {numeral(user.post_count).format('0,0')}
                  <span className="hidden-xs">
                    {' '}<FormattedMessage id="posts" />
                  </span>
                </Link>
              </li>
              <li>
                <Icon name="gavel" /> {numeral(parseInt(user.voting_power) / 10000).format('%0')}
                <span className="hidden-xs">
                  {' '}<FormattedMessage id="voting_power" />
                </span>
              </li>
              <li>
                <Link to={`/@${username}/followers`}>
                  <Icon name="people" /> {numeral(parseInt(user.follower_count)).format('0,0')}
                  <span className="hidden-xs">
                    {' '}<FormattedMessage id="followers" />
                  </span>
                </Link>
              </li>
              <li>
                <Link to={`/@${username}/followed`}>
                  <Icon name="people" /> {numeral(parseInt(user.following_count)).format('0,0')}
                  <span className="hidden-xs">
                    {' '}<FormattedMessage id="followed" />
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
      </div>
    );
  }
}
