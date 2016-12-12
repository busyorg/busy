import React from 'react';
import CommentItem from './CommentItem';

const CommentsList = ({ postId, comments, likeComment, unlikeComment, auth, openCommentingDraft }) => {
  if (!comments.listByPostId[postId]) {
    return null;
  }

  const { show, list } = comments.listByPostId[postId];
  const visibleList = list.sort((item1, item2) => {
    return (comments.comments[item1].net_votes - comments.comments[item2].net_votes) * -1;
  }).slice(0, show);


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
        />
      )}
    </div>
  );
};

export default CommentsList;
