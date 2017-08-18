import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
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
      <Scrollbars autoHide style={{ height: '400px' }}>
        <InfiniteSroll
          pageStart={0}
          loadMore={this.paginate}
          hasMore={users.length > noOfItemsToShow}
          useWindow={false}
        >
          <div className="ReactionsList__content">
            {take(users, noOfItemsToShow).map(user => <UserCard key={user} username={user} />)}
          </div>
        </InfiniteSroll>
      </Scrollbars>
    );
  }
}
