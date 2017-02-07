import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import BookmarkButton from '../bookmarks/BookmarkButton';
import MenuPost from '../app/Menu/MenuPost';
import Body from './Body';
import AuthorBio from './AuthorBio';
import Comments from '../comments/Comments';
import Avatar from '../widgets/Avatar';
import './PostSingleContent.scss';

const Tag = ({ tag }) => {
  if (tag.trim().length) {
    return (<span>
      <Link to={`/hot/${tag}`} className="btn btn-sm btn-secondary">
        {tag}
      </Link>
      {' '}
    </span>);
  }
  return null;
};

const PostSingleContent = ({
  content,
  toggleBookmark,
  bookmarks,
  reblog,
  isReblogged,
  canReblog,
  openCommentingDraft,
  likePost,
  unlikePost,
  dislikePost,
  isPostLiked,
  isPostDisliked,
  onEdit,
}) => {
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(content.json_metadata); } catch (e) { }
  return (
    <div className="PostSingleContent my-4">
      <div className="container">
        <div className="PostSingleContent__header mb-3">
          <Link to={`/@${content.author}`}>
            <Avatar sm username={content.author} />
            {' '}<span>{content.author}</span>
          </Link>
          <span className="hidden-xs">
            {' '}<FormattedMessage id="in" />{' '}
            <Link to={`/hot/${content.category}`}>#{content.category}</Link>
          </span>
          <span className="pull-right">
            <FormattedRelative value={content.created} />
            <BookmarkButton
              post={content}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
            />
          </span>
        </div>
        <div className="PostSingleContent__content mb-3">
          <h1 className="mvl">{content.title}</h1>
          <Body body={content.body} jsonMetadata={content.json_metadata} />
        </div>
        {jsonMetadata.tags &&
          <div className="mb-3">
            {jsonMetadata.tags.map(tag => <Tag key={tag} tag={tag} />)}
          </div>
        }
      </div>
      <MenuPost
        reblog={reblog}
        canReblog={canReblog}
        isReblogged={isReblogged}
        openCommentingDraft={openCommentingDraft}
        likePost={likePost}
        unlikePost={unlikePost}
        dislikePost={dislikePost}
        isPostLiked={isPostLiked}
        isPostDisliked={isPostDisliked}
        content={content}
        onEdit={onEdit}
      />
      <div className="container">
        <AuthorBio authorName={content.author} />
      </div>
      <div className="PostSingleContent__replies pt-5">
        <div className="container">
          <h1>
            <FormattedMessage id="comments" />{' '}
            <span className="text-info">{content.children}</span>
          </h1>
          <button
            className="btn btn-small btn-primary mb-3"
            onClick={(e) => {
              e.stopPropagation();
              openCommentingDraft();
            }}
          >
            Write a comment
          </button>
          {content.children > 0 &&
            <Comments
              postId={content.id}
              show
              isSinglePage
            />
          }
        </div>
      </div>
    </div>
  );
};

export default PostSingleContent;
