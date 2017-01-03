import React from 'react';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
import { has } from 'lodash/object';
import BodyShort from '../BodyShort';
import Flag from '../../widgets/Flag';
import Comments from '../../comments/Comments';
import PostActionTabs from '../PostActionTabs';
import Icon from '../../widgets/Icon';
import Avatar from '../../widgets/Avatar';
import PostModalLink from './../PostModalLink';
import LikesList from './../LikesList';
import ProfileTooltip from '../../user/profileTooltip/ProfileTooltip';

import './PostFeedCard.scss';

const PostFeedCard = ({
  post,
  onCommentRequest,
  bookmarks,
  toggleBookmark,
  notify,
  jsonMetadata,
  imagePath,
  embeds,
  openPostModal,
  reblog,
  isReblogged,
  showComments,
  showLikes,
  handleShowCommentsRequest,
  handleShowLikesRequest,
}) =>
  <div className="PostFeedCard">
    { post.first_reblogged_by &&
    <div className="PostFeedCard__cell PostFeedCard__cell--top">
      <ul>
        <li>
          <Icon name="repeat" sm />
          { ' Reblogged by ' }
          <Link to={`/@${post.first_reblogged_by}`}>@{post.first_reblogged_by}</Link>
        </li>
      </ul>
    </div>
    }

    <div className="PostFeedCard__cell PostFeedCard__cell--top">
      <ul>
        <li>
          <ProfileTooltip username={post.author}>
            <Avatar xs username={post.author} />
            { ` @${post.author}` }
          </ProfileTooltip>
          <span className="hidden-xs">
            { ' ' }in <Link to={`/hot/${post.category}`}>#{post.category}</Link>
          </span>
        </li>
        <li className="pull-right">
          <FormattedRelative value={post.created} />{' '}
          <a onClick={() => toggleBookmark(post.id)}>
            <Icon
              small
              name={bookmarks[post.id] ? 'bookmark' : 'bookmark_border'}
            />
          </a>
        </li>
      </ul>
    </div>

    { (imagePath && !has(embeds, '[0].embed')) &&
    <div className="PostFeedCard__thumbs">
      <PostModalLink
        post={post}
        onClick={() => openPostModal(post.id)}
      >
        <img src={imagePath} />
      </PostModalLink>
    </div>
    }

    { has(embeds, '[0].embed') &&
    <div className="PostFeedCard__thumbs" dangerouslySetInnerHTML={{ __html: embeds[0].embed }} />
    }

    <div className="PostFeedCard__cell PostFeedCard__cell--body">
      <h2>
        <Flag title={post.title} body={post.body} className="pr-1" />
        <PostModalLink
          post={post}
          onClick={() => openPostModal(post.id)}
        >
          { post.title }
        </PostModalLink>
      </h2>

      <BodyShort body={post.body} />
    </div>

    <div className="PostFeedCard__cell PostFeedCard__cell--bottom">
      <PostActionTabs
        post={post}
        notify={notify}
        onCommentRequest={onCommentRequest}
        onShowCommentsRequest={handleShowCommentsRequest}
        onShowLikesRequest={handleShowLikesRequest}
        reblog={reblog}
        isReblogged={isReblogged}
      />
    </div>

    <Comments
      postId={post.id}
      show={showComments}
      className="Comments--feed"
    />

    { showLikes &&
    <LikesList
      activeVotes={post.active_votes}
      netVotes={post.net_votes}
    />
    }

  </div>;

export default PostFeedCard;
