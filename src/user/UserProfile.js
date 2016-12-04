import 'babel-polyfill';
import React, { Component } from 'react';
import _ from 'lodash';
import steemdb from 'steemdb';
import moment from 'moment';
import numeral from 'numeral';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from '../helpers/stateHelpers';
import Loading from '../widgets/Loading';
import TriggerProfile from '../app/Trigger/TriggerProfile';
import { followUser, unfollowUser } from './userActions';
import Avatar from '../widgets/Avatar';
import Icon from '../widgets/Icon';
import Badge from '../widgets/Badge';

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

  render() {
    const { feed, posts, getFeedContent, getMoreFeedContent, limit } = this.props;
    const username = this.props.params.name;
    const edit = (
      this.props.auth.isAuthenticated
        && username === this.props.auth.user.name
    );

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
        <TriggerProfile
          params={this.props.params}
          username={username}
          edit={edit}
          hasFollow={this.hasFollow()}
          followingIsFetching={following.isFetching}
          isFollowing={isFollowing}
          onClickFollow={this.onClickFollow}
        />
        <section
          className="align-center bg-green profile-header"
          style={{
            backgroundImage: `url(${process.env.STEEMCONNECT_IMG_HOST}@${username}/cover)`,
            backgroundSize: 'cover',
            position: 'relative',
          }}
        >
          <div className="mvl">
            <Avatar xl username={username} reputation={_.has(user, 'name') && user.reputation} />
            <h1>
              <Icon name="star_border" md />{ ' ' }
              { _.has(jsonMetadata, 'profile.name') ? jsonMetadata.profile.name : `@${username} ` }
            </h1>
          </div>
        </section>
        <div className="profile">
          {!_.has(user, 'name') && <Loading />}
          {_.has(user, 'name') && <div>
            <ul className="secondary-nav">
              <li><i className="icon icon-md material-icons">library_books</i> {numeral(user.post_count).format('0,0')}<span className="hidden-xs"> Posts</span></li>
              <li><i className="icon icon-md material-icons">gavel</i> {numeral(parseInt(user.voting_power) / 10000).format('%0')}<span className="hidden-xs"> Voting Power</span></li>
              <li><Link to={`/@${username}/followers`}><i className="icon icon-md material-icons">people</i> {numeral(parseInt(user.followers_count)).format('0,0')}<span className="hidden-xs"> Followers</span></Link></li>
              <li><Link to={`/@${username}/followed`}><i className="icon icon-md material-icons">people</i> {numeral(parseInt(user.following_count)).format('0,0')}<span className="hidden-xs"> Followed</span></Link></li>
            </ul>
            <center className="container container-small my-2">
              <h3><Badge vestingShares={user.vesting_shares} /></h3>
              {_.has(jsonMetadata, 'profile.about') && <h3>{jsonMetadata.profile.about}</h3>}
              {_.has(jsonMetadata, 'profile.website') && <p><i className="icon icon-md material-icons">link</i> <a href={jsonMetadata.profile.website} target="_blank">{jsonMetadata.profile.website}</a></p>}
              {_.has(jsonMetadata, 'profile.location') && <p><i className="icon icon-md material-icons">pin_drop</i> {jsonMetadata.profile.location}</p>}
              <p>
                Joined {moment(user.created).fromNow()}
                , last activity {moment(user.last_vote_time).fromNow()}
              </p>
            </center>
          </div>}
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadContent={loadContentAction}
            loadMoreContent={loadMoreContentAction}
          />
        </div>
      </div>
    );
  }
}

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
