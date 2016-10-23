import React, { Component } from 'react';
import numeral from 'numeral';
import BodyShort from './../post/body-short';
import { Link } from 'react-router';

import './CommentItem.scss';

const renderOptimisticComment = (comment) => {
  return (
    <div className="CommentItem">
      <Link to={`/@${comment.author}`}>
        @{ comment.author }
      </Link>
      { ' ' }
      <b>
        $0.00
      </b>
      { ' ' }
      <BodyShort body={comment.body}/>
    </div>
  );
};

export default class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplies: false,
    };
  }

  toggleShowReplies = (e) => {
    this.setState({ showReplies: !this.state.showReplies });
  };

  render() {
    const { comment } = this.props;

    if (comment.isOptimistic) {
      return renderOptimisticComment(comment);
    }

    const payout =
      parseFloat(comment.total_payout_value) +
      parseFloat(comment.total_pending_payout_value);

    return (
      <div className="CommentItem">
        <Link to={`/@${comment.author}`}>
          @{ comment.author }
        </Link>
        { ' ' }
        <b>
          { numeral(payout).format('$0,0.00') }
        </b>
        { ' ' }
        <BodyShort body={comment.body}/>
        { (comment.children > 0 && !this.state.showReplies) &&
          <div className="Comments__showMore" onClick={this.toggleShowReplies}>
            {comment.children > 1
              ? `Show ${comment.children} replies...`
              : `Show ${comment.children} reply...`
            }
          </div>
        }

        { this.state.showReplies && this.props.children }

      </div>
    );
  }
};

