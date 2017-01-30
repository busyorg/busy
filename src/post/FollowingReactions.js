import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';
import Avatar from '../widgets/Avatar';
import Icon from '../widgets/Icon';

@connect(
  state => ({
    following: state.user.following.list,
  })
)
export default class FollowingReactions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const followingUpvotes = this.props.activeVotes.filter(vote =>
      _.includes(this.props.following, vote.voter) && vote.weight > 0
    ).sort((a, b) => a.rshares - b.rshares).reverse().slice(0, 5);
    const followingDownvotes = this.props.activeVotes.filter(vote =>
      _.includes(this.props.following, vote.voter) && vote.weight < 0
    ).sort((a, b) => a.rshares - b.rshares).reverse().slice(0, 5);

    if (!followingUpvotes.length && !followingDownvotes.length) {
      return false;
    } else {
      return (
        <div className="pb-2 px-3 text-left">
          {followingUpvotes.length > 0 &&
            <span>
              <Icon name="thumb_up" xs />
              {' '}
              {followingUpvotes.map((vote, idx) =>
                <span key={idx} className="mr-1">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{vote.voter}</Tooltip>}
                  >
                    <Link to={`/@${vote.voter}`}><Avatar username={vote.voter} xs /></Link>
                  </OverlayTrigger>
                </span>
              )}
            </span>
          }
          {followingDownvotes.length > 0 &&
            <span>
              <Icon name="thumb_down" xs />
              {' '}
              {followingDownvotes.map((vote, idx) =>
                <span key={idx} className="mr-1">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{vote.voter}</Tooltip>}
                  >
                    <a><Avatar username={vote.voter} xs /></a>
                  </OverlayTrigger>
                </span>
              )}
            </span>
          }
        </div>
      );
    }
  }
}
