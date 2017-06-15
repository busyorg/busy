import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import BookmarkButton from '../../bookmarks/BookmarkButton';
import MenuPost from '../../app/Menu/MenuPost';
import Body from './../Body';
import BodyShort from './../BodyShort';
import AuthorBio from './../AuthorBio';
import Avatar from '../../widgets/Avatar';
import SteemPowerIcon from '../../widgets/SteemPowerIcon';
import { jsonParse } from '../../helpers/formatter';

import './PostSingleContent.less';

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
  location
}) => {
  const jsonMetadata = jsonParse(content.json_metadata);
  const hasAnchoredLink = !!location.hash;
  return (
    <div className="PostSingleContent py-4">
      <div className="container">
        <h1>
          {content.title}
          <SteemPowerIcon className="ml-2" active={content.percent_steem_dollars === 0} />
        </h1>
        <div className="PostSingleContent__header mb-3">
          <Link to={`/@${content.author}`}>
            <Avatar sm username={content.author} />
            {' '}<span>{content.author}</span>
          </Link>
          <span className="hidden-xs">
            {' '}<FormattedMessage id="in" defaultMessage="in" />{' '}
            <Link to={`/hot/${content.category}`}>#{content.category}</Link>
          </span>
          <span className="pull-right">
            <FormattedRelative value={`${content.created}Z`} />
            <BookmarkButton
              post={content}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
            />
          </span>
        </div>
        <div className="PostSingleContent__content mb-3">
          {hasAnchoredLink
            ? <BodyShort body={content.body} />
            : <Body body={content.body} jsonMetadata={content.json_metadata} />
          }
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

    </div>
  );
};

export default withRouter(PostSingleContent);
