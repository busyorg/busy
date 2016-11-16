import React, { Component } from 'react';
import { Link } from 'react-router';
import BodyShort from '../post/body-short';
import Avatar from '../widgets/Avatar';
import Icon from '../widgets/Icon';

import './CommentItem.scss';

const renderOptimisticComment = (comment) => {
  return (
    <div className="CommentItem">
      <Link to={`/@${comment.author}`}>
        <Avatar xs username={comment.author} /> @{ comment.author }
      </Link>
      { ' ' }
      <b>$0.00</b>
      { ' ' }
      <BodyShort body={comment.body} />
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
            <Avatar xs username={comment.author} /> @{ comment.author }
          </Link>{ ' ' }
          <BodyShort body={comment.body} />
          { (comment.children > 0 && !this.state.showReplies) &&
            <a tabIndex="0" onClick={this.toggleShowReplies}>
              <Icon name="reply" s />View {comment.children}{' '}
              {comment.children > 1 ? 'replies' : 'reply'}
            </a>
          }
        { this.state.showReplies && this.props.children }
      </div>
    );
  }
};

