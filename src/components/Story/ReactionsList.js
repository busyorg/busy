import React from 'react';
import PropTypes from 'prop-types';
import InfiniteSroll from 'react-infinite-scroller';
import { take } from 'lodash';
import UserCard from '../UserCard';
import './ReactionsList.less';

export default class UserList extends React.Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    users: [],
  };

  state = { page: 1 };

  paginate = () => this.setState(prevState => ({ page: prevState.page + 1 }));

  render() {
    const { users } = this.props;
    const defaultPageItems = 20;
    const noOfItemsToShow = defaultPageItems * this.state.page;

    return (
      <div className="ReactionsList">
        <InfiniteSroll
          pageStart={0}
          loadMore={this.paginate}
          hasMore={users.length > noOfItemsToShow}
          useWindow={false}
        >
          {users.length === 0 && <div className="ReactionsList__empty">No users to show</div>}
          {take(users, noOfItemsToShow).map(user => <UserCard key={user} username={user} />)}
        </InfiniteSroll>
      </div>
    );
  }
}
