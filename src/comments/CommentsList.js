import React from 'react';
import CommentItem from './CommentItem';

const renderComments = (args) => {
  const { list, ...restArgs } = args;

  return list.map(({ id , children }) => {
    const comment = args.comments[id];

    return (
      <CommentItem
        key={id}
        comment={comment}
        likeComment={args.likeComment}
        unlikeComment={args.unlikeComment}
        auth={args.auth}
        openCommentingDraft={args.openCommentingDraft}
      >
        { Object.keys(children).length > 0 &&
          renderComments({
            list: children,
            ...restArgs
          })
        }
      </CommentItem>
    );
  })
};

const CommentsList = ({ postId, comments, likeComment, unlikeComment, auth, openCommentingDraft }) => {
  if (!comments.lists[postId]) {
    return null;
  }

  const { show, list } = comments.lists[postId];
  const visibleList = list.slice(0, show);

  return (
    <div className="CommentsList">
      { renderComments({
          list: visibleList,
          comments: comments.comments,
          likeComment,
          unlikeComment,
          auth,
          openCommentingDraft
        })
      }
    </div>
  );
};

export default CommentsList;
