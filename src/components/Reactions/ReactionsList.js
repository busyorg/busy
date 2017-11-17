import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteSroll from 'react-infinite-scroller';
import { take } from 'lodash';
import { FormattedNumber } from 'react-intl';
import UserCard from '../UserCard';
import USDDisplay from '../Utils/USDDisplay';
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
                alt={
                  <span>
                    <USDDisplay value={vote.rshares * ratio} />
                    <span className="ReactionsList__bullet" />
                    <FormattedNumber
                      style="percent" // eslint-disable-line react/style-prop-object
                      value={vote.percent / 10000}
                    />
                  </span>
                }
              />
            ))}
          </div>
        </InfiniteSroll>
      </Scrollbars>
    );
  }
}
