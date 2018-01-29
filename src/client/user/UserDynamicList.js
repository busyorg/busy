import React from 'react';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import UserCard from '../components/UserCard';
import Loading from '../components/Icon/Loading';
import './UserDynamicList.less';

export default class UserDynamicList extends React.Component {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    fetcher: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hasMore: true,
      users: [],
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  handleLoadMore() {
    const { fetcher, limit } = this.props;
    const { users } = this.state;

    this.setState(
      {
        loading: true,
      },
      () => {
        fetcher(users).then(newUsers =>
          this.setState(state => ({
            loading: false,
            hasMore: newUsers.length === limit,
            users: [...state.users, ...newUsers.slice(1)],
          })),
        );
      },
    );
  }

  render() {
    const { loading, hasMore, users } = this.state;
    return (
      <div className="UserDynamicList">
        <div className="container UserDynamicList__container">
          <ReduxInfiniteScroll
            elementIsScrollable={false}
            loadingMore={loading}
            hasMore={hasMore}
            loader={<Loading />}
            loadMore={this.handleLoadMore}
          >
            {users.map(user => <UserCard key={user} username={user} />)}
          </ReduxInfiniteScroll>
        </div>
      </div>
    );
  }
}
