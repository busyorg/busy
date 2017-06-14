import React from 'react';
import { Link } from 'react-router-dom';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import { isNumber, take } from 'lodash';
import UserCard from '../widgets/UserCard';
import Follow from '../widgets/Follow';
import Avatar from '../widgets/Avatar';
import Icon from '../widgets/Icon';

const UserRow = props => <h3>
  <Link to={`/@${props.username}`}>
    <Avatar username={props.username} sm /> {props.username}
    {' '}<Follow username={props.username} />
  </Link>
</h3>;

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filterText: null, page: 1 };
  }

  search = (event) => {
    this.setState({
      search: event.target.value.trim().toLowerCase(),
      page: 1,
    });
  };

  paginate = () => {
    const page = isNumber(this.state.page) ? (this.state.page + 1) : 1;
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
      <div>
        <div className="input-group input-group-lg">
          <span className="input-group-addon">
            <Icon name="search" lg />
          </span>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search"
            onChange={this.search}
          />
        </div>
        <hr className="mt-0" />
        <ReduxInfiniteScroll
          loadMore={this.paginate}
          elementIsScrollable={false}
          hasMore={users.length > noOfItemsToShow}
          className="row my-5"
        >
          {take(users, noOfItemsToShow).map(user =>
            <UserCard key={user} username={user} label={<Follow username={user} />} />
          )}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}
