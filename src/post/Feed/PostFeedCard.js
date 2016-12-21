import React from 'react';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
import { has } from 'lodash/object';

import BodyShort from '../BodyShort';
import Mentions from '../Mentions';
import Flag from '../../widgets/Flag';
import Comments from '../../comments/Comments';
import PostActionButtons from '../PostActionButtons';
import Icon from '../../widgets/Icon';
import Avatar from '../../widgets/Avatar';
import PostModalLink from './../PostModalLink';
import LikesList from './../LikesList';

import './PostFeedCard.scss';

const PostFeedCard = ({
  post,
  onCommentRequest,
  bookmarks,
  toggleBookmark,
  notify,
  jsonMetaData,
  imageName,
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
          <Link to={`/@${post.author}`}>
            <Avatar xs username={post.author} />
            { ` @${post.author}` }
          </Link>
          <span className="hidden-xs">
            { ' ' }in <Link to={`/hot/${post.category}`}>#{post.category}</Link>
          </span>
          { post.parent_author &&
          <span className="hidden-xs">
            { ' replied ' }
            <Link to={`/@${post.parent_author}`}>
              @{post.parent_author}
            </Link>
            &#8217;s&nbsp;
            <Link to={`/${post.category}/@${post.parent_author}/${post.parent_permlink}`}>
              post.
            </Link>
          </span>
          }

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

    { (imageName && !has(embeds, '[0].embed')) &&
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
        <Flag title={post.title} body={post.body} className="prs" />
        <PostModalLink
          post={post}
          onClick={() => openPostModal(post.id)}
        >
          {post.title}
        </PostModalLink>
      </h2>

      <Mentions jsonMetaData={jsonMetaData} />

      <p>
        <BodyShort body={post.body} />
      </p>
    </div>

    <div className="PostFeedCard__cell PostFeedCard__cell--bottom">
      <PostActionButtons
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
