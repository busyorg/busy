import React from 'react';
import people from '../helpers/people';
import DiscoverUser from './DiscoverUser';
import SteemAPI from '../steemAPI';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';

const displayLimit = 20;

class DiscoverContent extends React.Component {
  state = {
    users: [],
  };

  componentDidMount() {
    const initialUsers = people.slice(0, displayLimit);
    SteemAPI.sendAsync('get_accounts', [initialUsers]).then(users =>
      this.setState({
        users,
      }),
    );
  }

  handleLoadMore = () => {
    const { users } = this.state;
    const moreUsersStartIndex = users.length;
    const moreUsers = people.slice(moreUsersStartIndex, moreUsersStartIndex + displayLimit);
    SteemAPI.sendAsync('get_accounts', [moreUsers]).then(moreUsersResponse =>
      this.setState({
        users: users.concat(moreUsersResponse),
      }),
    );
  };

  render() {
    const { users } = this.state;
    const hasMore = users.length !== people.length;
    return (
      <div>
        <ReduxInfiniteScroll hasMore={hasMore} loadMore={this.handleLoadMore}>
          {users.map(user => <DiscoverUser user={user} key={user.id} />)}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}

export default DiscoverContent;
