import React from 'react';
import CommentItem from './CommentItem';
import { sortCommentsFromSteem } from '../helpers/stateHelpers';

const CommentsList = ({
  postId,
  comments,
  likeComment,
  unlikeComment,
  dislikeComment,
  auth,
  openCommentingDraft,
  isSinglePage,
  sortOrder
}) => {
  if (!comments.listByPostId[postId]) {
    return <div />;
  }

  const { show, list } = comments.listByPostId[postId];
  const showLimit = isSinglePage ? list.length : show;

  const visibleList = sortCommentsFromSteem(list, comments, sortOrder).slice(0, showLimit);

  return (
    <div className="CommentsList">
      { visibleList.map(commentId =>
        <CommentItem
          key={commentId}
          comment={comments.comments[commentId]}
          allComments={comments}
          likeComment={likeComment}
          unlikeComment={unlikeComment}
          dislikeComment={dislikeComment}
          auth={auth}
          openCommentingDraft={openCommentingDraft}
          isSinglePage={isSinglePage}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
};

export default CommentsList;
