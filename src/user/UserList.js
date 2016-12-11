import React from 'react';
import { Link } from 'react-router';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import _ from 'lodash';

import './UserList.scss';
import Avatar from '../widgets/Avatar';

const UserRow = props => <div className="UserList pvm">
  <Avatar md username={props.username} className="mrm" />
  <Link to={`/@${props.username}`}>@{props.username}</Link>
</div>;

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filter: null, page: 1 };
  }

  filterTextChange = (event) => {
    this.setState({
      filter: event.target.value.trim().toLowerCase(),
      page: 1
    });
  }

  paginate = () => {
    const page = _.isNumber(this.state.page) ? (this.state.page + 1) : 1;
    this.setState({ page });
  }

  render() {
    const filter = this.state.filter;
    const defaultPageItems = 10;
    const noOfItemsToShow = defaultPageItems * this.state.page;
    const users = this.state.filter ?
      _.filter(this.props.users, user => user.indexOf(filter) >= 0) : this.props.users;

    return (<div>
      <input placeholder="filter" onChange={this.filterTextChange} />
      <ReduxInfiniteScroll
        loadMore={this.paginate}
        elementIsScrollable={false}
        hasMore={users.length > noOfItemsToShow}
      >
        {_.take(users, noOfItemsToShow).map(user => <UserRow username={user} key={user} />)}
      </ReduxInfiniteScroll>
    </div>);
  }
}
