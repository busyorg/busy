import React from 'react';
import PropTypes from 'prop-types';
import { isNumber, take } from 'lodash';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import UserCard from '../components/UserCard';

export default class UserList extends React.Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    users: [],
  };

  state = { filterText: null, page: 1 };

  search = event => {
    this.setState({
      search: event.target.value.trim().toLowerCase(),
      page: 1,
    });
  };

  paginate = () => {
    const page = isNumber(this.state.page) ? this.state.page + 1 : 1;
    this.setState({ page });
  };

  render() {
    const search = this.state.search;
    const defaultPageItems = 10;
    const noOfItemsToShow = defaultPageItems * this.state.page;
    const users = this.state.search
      ? this.props.users.filter(user => user.indexOf(search) >= 0)
      : this.props.users;
    return (
      <ReduxInfiniteScroll
        loadMore={this.paginate}
        elementIsScrollable={false}
        hasMore={users.length > noOfItemsToShow}
        className="row my-5"
      >
        {take(users, noOfItemsToShow).map(user => <UserCard key={user} username={user} />)}
      </ReduxInfiniteScroll>
    );
  }
}
