import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative, injectIntl } from 'react-intl';
import BodyShort from '../BodyShort';
import PostActionButtons from '../PostActionButtons';
import Avatar from '../../widgets/Avatar';
import SteemPowerIcon from '../../widgets/SteemPowerIcon';
import BookmarkButton from '../../bookmarks/BookmarkButton';
import { ProfileTooltipOrigin } from '../../widgets/tooltip/ProfileTooltip';
import './PostFeedList.less';

const PostFeedList = ({
  post,
  onCommentRequest,
  bookmarks,
  toggleBookmark,
  notify,
  imagePath,
  reblog,
  isReblogged,
  handleShowCommentsRequest,
  handleShowLikesRequest,
  layout,
  openPostModal
}) => {
  const handlePostClick = (e) => {
    e.preventDefault();
    openPostModal(post.id);
  };

  return (
    <div className="PostFeedList">
      {imagePath &&
        <div className="PostFeedList__thumbs">
          <Link to={post.url} onClick={e => handlePostClick(e)}>
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
          <Link to={post.url} onClick={e => handlePostClick(e)}>
            {post.title}
            <SteemPowerIcon className="ml-2" active={post.percent_steem_dollars === 0} />
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
            <FormattedMessage id="by" defaultMessage="by" />{' '}
            <ProfileTooltipOrigin username={post.author}>
              <Link to={`/@${post.author}`}>
                <Avatar xs username={post.author} />
                {` ${post.author}`}
              </Link>
            </ProfileTooltipOrigin>
            <span className="hidden-xs">
              {' '}<FormattedMessage id="in" defaultMessage="in" />
              {' '}<Link to={`/hot/${post.category}`}>#{post.category}</Link>{' '}
              <span className="text-info">
                <FormattedRelative value={`${post.created}Z`} />
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(PostFeedList);
