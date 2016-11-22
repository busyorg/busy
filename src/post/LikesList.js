import React, { Component } from 'react';
import { Link } from 'react-router';
import Avatar from '../widgets/Avatar';
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
          activeVotes.slice(0, this.state.show).map(vote =>
            <div className="LikesList__item">
              <Avatar xs username={vote.voter} />
              { ' ' }
              <Link to={`/@${vote.voter}`}>
                @{vote.voter}
              </Link>
              { ' ' }
              {vote.percent < 0
                ? 'Disliked'
                : 'Liked'
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
