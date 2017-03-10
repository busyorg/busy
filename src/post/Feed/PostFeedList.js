import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage, FormattedRelative, injectIntl } from 'react-intl';
import BodyShort from '../BodyShort';
import PostActionButtons from '../PostActionButtons';
import Avatar from '../../widgets/Avatar';
import BookmarkButton from '../../bookmarks/BookmarkButton';
import { ProfileTooltipOrigin } from '../../widgets/tooltip/ProfileTooltip';
import './PostFeedList.scss';

const PostFeedList = ({
  post,
  onCommentRequest,
  bookmarks,
  toggleBookmark,
  notify,
  jsonMetadata,
  imagePath,
  reblog,
  isReblogged,
  handleShowCommentsRequest,
  handleShowLikesRequest,
  layout,
  intl,
  openPostModal
}) =>
  <div className="PostFeedList">
    { imagePath &&
      <div className="PostFeedList__thumbs">
        <Link to={post.url} onClick={() => openPostModal(post.id)}>
          <img key={imagePath} src={imagePath} />
        </Link>
      </div>
    }
    <div className="PostFeedList__cell PostFeedList__cell--body">
      <BookmarkButton
        post={post}
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
      />
      <h2>
        <Link to={post.url} onClick={() => openPostModal(post.id)}>
          {post.title}
        </Link>
      </h2>
      <BodyShort body={post.body} />
      <div className="PostFeedList__cell PostFeedList__cell--bottom">
        <PostActionButtons
          post={post}
          notify={notify}
          onCommentRequest={onCommentRequest}
          onShowCommentsRequest={handleShowCommentsRequest}
          onShowLikesRequest={handleShowLikesRequest}
          reblog={reblog}
          isReblogged={isReblogged}
          layout={layout}
        />
        <span>
          <FormattedMessage id="by" />{' '}
          <ProfileTooltipOrigin username={post.author} >
            <Link to={`/@${post.author}`}>
              <Avatar xs username={post.author} />
              {` ${post.author}`}
            </Link>
          </ProfileTooltipOrigin>
          <span className="hidden-xs">
            {' '}<FormattedMessage id="in" />
            {' '}<Link to={`/hot/${post.category}`}>#{post.category}</Link>{' '}
            <span className="text-info">
              <FormattedRelative value={post.created} />
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>;

export default injectIntl(PostFeedList);
