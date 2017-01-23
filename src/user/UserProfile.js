import 'babel-polyfill';
import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import _ from 'lodash';
import { Link } from 'react-router';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from '../helpers/stateHelpers';
import { getAccount } from '../helpers/apiHelpers';
import Loading from '../widgets/Loading';
import Icon from '../widgets/Icon';
import Badge from '../widgets/Badge';
import Donor from '../widgets/Donor';
import donors from '../helpers/donors';
import EmptyUserProfile from '../statics/EmptyUserProfile';
import EmptyUserOwnProfile from '../statics/EmptyUserOwnProfile';

export default class UserProfile extends Component {
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
    getAccount(this.props.params.name)
      .then((user) => {
        this.setState({ user });
      });
  }

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
    const jsonMetadata = user.json_metadata;

    return (
      <div>
        <div className="profile">
          {!_.has(user, 'name') && <Loading />}
          {_.has(user, 'name') && <div>
            <div className="container container-small my-5 text-center">
              <h3><Badge vestingShares={user.vesting_shares} /></h3>
              {donors[username] &&
                <h3>
                  <Link to="/donors">
                    <Donor rank={donors[username]} />
                  </Link>
                </h3>
              }
              {_.has(jsonMetadata, 'profile.about') &&
                <h3>{jsonMetadata.profile.about}</h3>
              }
              {_.has(jsonMetadata, 'profile.website') &&
                <p>
                  <Icon name="link" />{' '}
                  <a href={jsonMetadata.profile.website} target="_blank" rel="noopener noreferrer">
                    {jsonMetadata.profile.website}
                  </a>
                </p>
              }
              {_.has(jsonMetadata, 'profile.location') &&
                <p>
                  <Icon name="pin_drop" />{' '}
                  {jsonMetadata.profile.location}
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

          {(content.length === 0 && !isFetching && isOwnProfile) &&
            <EmptyUserOwnProfile />
          }

          {(content.length === 0 && !isFetching && !isOwnProfile) &&
            <EmptyUserProfile />
          }
        </div>
      </div>
    );
  }
}
