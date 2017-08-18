import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteSroll from 'react-infinite-scroller';
import { take } from 'lodash';
import { sortVotes } from '../../helpers/sortHelpers';
import UserCard from '../UserCard';
import './ReactionsList.less';

export default class UserList extends React.Component {
  static propTypes = {
    votes: PropTypes.arrayOf(PropTypes.shape()),
    reverse: PropTypes.bool,
  };

  static defaultProps = {
    votes: [],
    reverse: false,
  };

  state = { page: 1 };

  paginate = () => this.setState(prevState => ({ page: prevState.page + 1 }));

  render() {
    const { votes, reverse } = this.props;
    const defaultPageItems = 20;
    const noOfItemsToShow = defaultPageItems * this.state.page;

    const users = votes
      .sort(sortVotes)
      .map(vote => vote.voter);

    if (reverse) {
      users.reverse();
    }

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
