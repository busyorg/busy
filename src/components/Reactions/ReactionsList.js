import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteSroll from 'react-infinite-scroller';
import { take } from 'lodash';
import UserCard from '../UserCard';
import './ReactionsList.less';

export default class UserList extends React.Component {
  static propTypes = {
    votes: PropTypes.arrayOf(PropTypes.shape()),
    ratio: PropTypes.number,
  };

  static defaultProps = {
    votes: [],
    ratio: 0,
  };

  state = { page: 1 };

  paginate = () => this.setState(prevState => ({ page: prevState.page + 1 }));

  render() {
    const { votes, ratio } = this.props;
    const defaultPageItems = 20;
    const noOfItemsToShow = defaultPageItems * this.state.page;

    return (
      <Scrollbars autoHide style={{ height: '400px' }}>
        <InfiniteSroll
          pageStart={0}
          loadMore={this.paginate}
          hasMore={votes.length > noOfItemsToShow}
          useWindow={false}
        >
          <div className="ReactionsList__content">
            {take(votes, noOfItemsToShow).map(vote => (
              <UserCard
                key={vote.voter}
                username={vote.voter}
                voteUsd={vote.rshares * ratio}
                votePercent={vote.percent / 10000}
              />
            ))}
          </div>
        </InfiniteSroll>
      </Scrollbars>
    );
  }
}
