import React, { Component } from 'react';
import { Link } from 'react-router';
import numeral from 'numeral';
import Avatar from '../widgets/Avatar';
import { ProfileTooltipOrigin } from '../widgets/tooltip/ProfileTooltip';
import './LikesList.scss';

export default class LikesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 10,
    };
  }

  handleShowMore() {
    this.setState({
      show: this.state.show + 10,
    });
  }

  render() {
    const { activeVotes } = this.props;
    const hasMore = activeVotes.length > this.state.show;
    return (
      <div className="LikesList">
        {
          activeVotes
            .sort((a, b) => a.rshares - b.rshares)
            .reverse()
            .slice(0, this.state.show).map(vote =>
              <div className="LikesList__item" key={vote.voter}>
                <ProfileTooltipOrigin username={vote.voter} >
                  <Link to={`/@${vote.voter}`}>
                    <Avatar xs username={vote.voter} />
                    {' '}
                    {vote.voter}
                  </Link>
                </ProfileTooltipOrigin>
                {' '}
                {vote.percent < 0
                  ? <span className="text-danger">Disliked</span>
                  : <span>
                    Liked{' '}
                    <span className="text-info">
                      {numeral((vote.percent / 10000)).format('0%')}
                    </span>
                  </span>
                }
              </div>
          )
        }
        { hasMore &&
          <a
            className="LikesList__showMore"
            tabIndex="0"
            onClick={() => this.handleShowMore()}
          >
            See More Likes
          </a>
        }
      </div>
    );
  }
}
