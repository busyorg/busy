import React from 'react';
import CommentItem from './CommentItem';
import { sortCommentsFromSteem } from '../helpers/stateHelpers';

const CommentsList = ({
  postId,
  comments,
  likeComment,
  unlikeComment,
  auth,
  openCommentingDraft,
  isSinglePage
}) => {
  if (!comments.listByPostId[postId]) {
    return null;
  }

  const { show, list } = comments.listByPostId[postId];
  const showLimit = isSinglePage ? list.length : show;

  const visibleList = sortCommentsFromSteem(list, comments).slice(0, showLimit);

  return (
    <div className="CommentsList">
      { visibleList.map((commentId, idx) =>
        <CommentItem
          key={idx}
          comment={comments.comments[commentId]}
          allComments={comments}
          likeComment={likeComment}
          unlikeComment={unlikeComment}
          auth={auth}
          openCommentingDraft={openCommentingDraft}
          isSinglePage={isSinglePage}
        />
      )}
    </div>
  );
};

export default CommentsList;
