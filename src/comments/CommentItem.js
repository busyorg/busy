import React from 'react';
import numeral from 'numeral';
import BodyShort from './../post/body-short';
import { Link } from 'react-router';

import './CommentItem.scss';

const CommentItem = ({ comment }) => {
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
      <BodyShort body={comment.body} />
    </div>
  );
};

export default CommentItem;
