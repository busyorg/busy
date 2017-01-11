import 'babel-polyfill';
import React, { Component } from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import  _ from 'lodash';
import steemdb from 'steemdb';
import numeral from 'numeral';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FavoriteUserButton from '../favorites/FavoriteUserButton';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from '../helpers/stateHelpers';
import Loading from '../widgets/Loading';
import Follow from '../widgets/Follow';
import { followUser, unfollowUser } from './userActions';
import Icon from '../widgets/Icon';
import Avatar from '../widgets/Avatar';
import Badge from '../widgets/Badge';
import Donor from '../widgets/Donor';
import donors from '../helpers/donors';
import EmptyUserProfile from '../statics/EmptyUserProfile';
import EmptyUserOwnProfile from '../statics/EmptyUserOwnProfile';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      isFollowing: false,
      isFollowingIsLoading: true,
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
    steemdb.accounts({
      account: this.props.params.name
    }, (err, result) => {
      this.setState({ user: result[0] });
    });
  }

  hasFollow() {
    const username = this.props.params.name;
    return (
      this.props.auth.isAuthenticated
        && username !== this.props.auth.user.name
    );
  }

  onClickFollow = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const { following } = this.props;
    const username = this.props.params.name;
    const isFollowing = following.list && following.list.includes(username);

    if (isFollowing) {
      this.props.unfollowUser(this.props.params.name);
    } else {
      this.props.followUser(this.props.params.name);
    }
  };

  isFavorited() {
    const { favorites } = this.props;
    const username = this.props.params.name;
    return username && favorites.includes(username);
  }

  render() {
    const { feed, posts, getFeedContent, getMoreFeedContent, limit, auth } = this.props;
    const username = this.props.params.name;
    const isOwnProfile = auth.isAuthenticated && username === auth.user.name;

    const content = getFeedContentFromState('blog', username, feed, posts);
    const isFetching = getFeedLoadingFromState('blog', username, feed);
    const hasMore = getFeedHasMoreFromState('blog', username, feed);
    const loadContentAction = () => getFeedContent({
      sortBy: 'blog',
      category: username,
      limit
    });

    const loadMoreContentAction = () => getMoreFeedContent({
      sortBy: 'blog',
      category: username,
      limit
    });

    const user = this.state.user;
    let jsonMetadata = {};
    try { jsonMetadata = JSON.parse(user.json_metadata); } catch (e) { jsonMetadata = {}; }

    const { following } = this.props;
    const isFollowing = following.list && following.list.includes(username);

    return (
      <div>
        <section
          className="align-center bg-green profile-header"
          style={{
            backgroundImage: `url(${process.env.STEEMCONNECT_IMG_HOST}/@${username}/cover)`,
            backgroundSize: 'cover',
            position: 'relative',
          }}
        >
          <div className="my-3">
            <Avatar xl username={username} reputation={_.has(user, 'name') && user.reputation} />
            <h1>
              <FavoriteUserButton
                isFavorited={this.isFavorited()}
                onClick={this.isFavorited()
                  ? () => this.props.removeUserFavorite(username)
                  : () => this.props.addUserFavorite(username)
                }
              />
              { _.has(jsonMetadata, 'profile.name') ? jsonMetadata.profile.name : `@${username}` }
              { ' ' }
              <Follow
                hasFollow={this.hasFollow()}
                followingIsFetching={following.isFetching}
                isFollowing={isFollowing}
                onClickFollow={this.onClickFollow}
              />
            </h1>
          </div>
        </section>
        <div className="profile">
          { !_.has(user, 'name') && <Loading />}
          { _.has(user, 'name') && <div>
            <ul className="secondary-nav">
              <li>
                <Icon name="library_books" /> {numeral(user.post_count).format('0,0')}
                <span className="hidden-xs">
                  { ' ' }<FormattedMessage id="posts" />
                </span>
              </li>
              <li>
                <Icon name="gavel" /> {numeral(parseInt(user.voting_power) / 10000).format('%0')}
                <span className="hidden-xs">
                  { ' ' }<FormattedMessage id="voting_power" />
                </span>
              </li>
              <li>
                <Link to={`/@${username}/followers`}>
                  <Icon name="people" /> {numeral(parseInt(user.followers_count)).format('0,0')}
                  <span className="hidden-xs">
                    { ' ' }<FormattedMessage id="followers" />
                  </span>
                </Link>
              </li>
              <li>
                <Link to={`/@${username}/followed`}>
                  <Icon name="people" /> {numeral(parseInt(user.following_count)).format('0,0')}
                  <span className="hidden-xs">
                    { ' ' }<FormattedMessage id="followed" />
                  </span>
                </Link>
              </li>
            </ul>
            <div className="container container-small my-3 text-center">
              <h3><Badge vestingShares={user.vesting_shares} /></h3>
              { donors[username] &&
                <h3>
                  <Link to="/donors">
                    <Donor rank={donors[username]} />
                  </Link>
                </h3>
              }
              { _.has(jsonMetadata, 'profile.about') &&
                <h3>{ jsonMetadata.profile.about }</h3>
              }
              { _.has(jsonMetadata, 'profile.website') &&
                <p>
                  <Icon name="link" />{ ' ' }
                  <a href={jsonMetadata.profile.website} target="_blank">
                    { jsonMetadata.profile.website }
                  </a>
                </p>
              }
              { _.has(jsonMetadata, 'profile.location') &&
                <p>
                  <Icon name="pin_drop" />{ ' ' }
                  { jsonMetadata.profile.location }
                </p>
              }
              <p>
                Joined <FormattedRelative value={user.created} />
                , last activity <FormattedRelative value={user.last_vote_time} />
              </p>
            </div>
          </div>}
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadContent={loadContentAction}
            loadMoreContent={loadMoreContentAction}
            route={this.props.route}
          />

          { (content.length === 0 && !isFetching && isOwnProfile) &&
            <EmptyUserOwnProfile />
          }

          { (content.length === 0 && !isFetching && !isOwnProfile) &&
            <EmptyUserProfile />
          }
        </div>
      </div>
    );
  }
}

// TODO:(p0o) refactor this to User.js container and avoid adding redux actions or state params here

const mapStateToProps = function (state) {
  return {
    following: state.userProfile.following,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    followUser: (...args) => dispatch(followUser(...args)),
    unfollowUser: (...args) => dispatch(unfollowUser(...args)),
  };
};

Profile = connect(mapStateToProps, mapDispatchToProps)(Profile);

export default Profile
