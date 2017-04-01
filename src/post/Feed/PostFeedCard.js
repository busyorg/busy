import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage, FormattedRelative, injectIntl } from 'react-intl';
import _ from 'lodash';
import numeral from 'numeral';
import { getHtml } from '../Body';
import BodyShort from '../BodyShort';
import PostFeedEmbed from '../PostFeedEmbed';
import BookmarkButton from '../../bookmarks/BookmarkButton';
import Comments from '../../comments/Comments';
import PostActionButtons from '../PostActionButtons';
import Icon from '../../widgets/Icon';
import Avatar from '../../widgets/Avatar';
import LikesList from './../LikesList';
import { ProfileTooltipOrigin } from '../../widgets/tooltip/ProfileTooltip';
import Reactions from '../Reactions';

import { calculatePayout } from '../../helpers/steemitHelpers';
import {
  getPositions,
  isPostStartsWithAPicture,
  isPostStartsWithAnEmbed,
  isPostWithPictureBeforeFirstHalf,
  isPostWithEmbedBeforeFirstHalf
} from './PostFeedCardHelper';

import './PostFeedCard.scss';

const AmountWithLabel = ({ label, amount }) => (
  _.isNumber(amount)
    ? <div>{label}: {numeral(amount).format('$0,0.00')}</div>
    : null
);

const PayoutDetail = ({ show, post }) => {
  if (show) {
    const {
      payoutLimitHit,
      potentialPayout,
      promotionCost,
      cashoutInTime,
      isPayoutDeclined,
      maxAcceptedPayout,
      pastPayouts,
      authorPayouts,
      curatorPayouts,
    } = calculatePayout(post);

    return (<div className="PostFeedCard__cell--tab-content p-3">
      {payoutLimitHit && <div>Payout limit reached on this post</div>}
      <AmountWithLabel label="Potential Payout" amount={potentialPayout} />
      <AmountWithLabel label="Promoted" amount={promotionCost} />
      {!isPayoutDeclined && cashoutInTime &&
        <div>Will release <FormattedRelative value={cashoutInTime} /></div>}
      {isPayoutDeclined && <div>Declined Payout</div>}
      <AmountWithLabel label="Max Accepted Payout" amount={maxAcceptedPayout} />
      <AmountWithLabel label="Total Past Payouts" amount={pastPayouts} />
      <AmountWithLabel label="Authors Payout" amount={authorPayouts} />
      <AmountWithLabel label="Curators Payout" amount={curatorPayouts} />
    </div>);
  }
  return null;
};


const PostFeedCard = ({
  post,
  onCommentRequest,
  bookmarks,
  toggleBookmark,
  notify,
  jsonMetadata,
  imagePath,
  embeds,
  reblog,
  isReblogged,
  showComments,
  showLikes,
  showPayout,
  handleShowCommentsRequest,
  handleShowLikesRequest,
  handleShowPayoutRequest,
  layout,
  openPostModal,
}) => {
  const isReplyPost = !!post.parent_author;
  const preview = {
    text: () => (
      <div key="text" className="PostFeedCard__cell PostFeedCard__cell--text">
        <BodyShort body={post.body} />
      </div>
    ),

    embed: () => (embeds && embeds[0]) && <PostFeedEmbed key="embed" embed={embeds[0]} />,

    image: () => imagePath &&
      <div key="image" className="PostFeedCard__thumbs">
        <Link to={post.url} onClick={e => handlePostClick(e)}>
          <img alt="post" key={imagePath} src={imagePath} />
        </Link>
      </div>
  };

  const htmlBody = getHtml(post.body);
  const tagPositions = getPositions(htmlBody);
  const bodyData = [];

  if (isPostStartsWithAPicture(tagPositions)) {
    bodyData.push(preview.image());
    bodyData.push(preview.text());
  } else if (isPostStartsWithAnEmbed(tagPositions)) {
    bodyData.push(preview.embed());
    bodyData.push(preview.text());
  } else if (isPostWithPictureBeforeFirstHalf(tagPositions)) {
    bodyData.push(preview.text());
    bodyData.push(preview.image());
  } else if (isPostWithEmbedBeforeFirstHalf(tagPositions)) {
    bodyData.push(preview.text());
    bodyData.push(preview.embed());
  } else {
    bodyData.push(preview.text());
  }

  const handlePostClick = (e) => {
    e.preventDefault();
    openPostModal(post.id);
  };

  return (
    <div className="PostFeedCard">
      {post.first_reblogged_by &&
        <div className="PostFeedCard__cell PostFeedCard__cell--top">
          <ul>
            <li>
              <Icon name="repeat" sm />
              {' Reblogged by '}
              <ProfileTooltipOrigin username={post.first_reblogged_by} >
                <Link to={`/@${post.first_reblogged_by}`}>{post.first_reblogged_by}</Link>
              </ProfileTooltipOrigin>
            </li>
          </ul>
        </div>
      }

      <div className="PostFeedCard__cell PostFeedCard__cell--top">
        <ul>
          <li>
            <ProfileTooltipOrigin username={post.author} >
              <Link to={`/@${post.author}`}>
                <Avatar xs username={post.author} />
                {` ${post.author}`}
              </Link>
            </ProfileTooltipOrigin>

            <span className="hidden-xs">
              {' '}<FormattedMessage id="in" />{' '}
              {isReplyPost ?
                <Link to={`${post.url}`}>
                  {post.root_title}
                </Link>
                :
                <Link to={`/hot/${post.category}`}>#{post.category}</Link>
              }

            </span>
          </li>
          <li className="pull-right">
            <FormattedRelative value={`${post.created}Z`} />{' '}
            <BookmarkButton
              post={post}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
            />
          </li>
        </ul>
      </div>

      <div className="PostFeedCard__cell PostFeedCard__cell--body">
        <h2>
          <Link to={post.url} onClick={e => handlePostClick(e)}>
            {post.title}
          </Link>
        </h2>
      </div>
      {bodyData}

      <div className="PostFeedCard__cell PostFeedCard__cell--bottom">
        <PostActionButtons
          post={post}
          notify={notify}
          onCommentRequest={onCommentRequest}
          onShowCommentsRequest={handleShowCommentsRequest}
          onShowLikesRequest={handleShowLikesRequest}
          onShowPayoutRequest={handleShowPayoutRequest}
          reblog={reblog}
          isReblogged={isReblogged}
          layout={layout}
        />
      </div>

      <Reactions
        post={post}
        handleShowLikesRequest={handleShowLikesRequest}
        handleShowCommentsRequest={handleShowCommentsRequest}
      />

      <Comments
        postId={post.id}
        show={showComments}
        className="Comments--feed"
      />

      <PayoutDetail show={showPayout} post={post} />

      {showLikes &&
        <LikesList
          activeVotes={post.active_votes}
          netVotes={post.net_votes}
        />
      }

    </div>
  );
};

export default injectIntl(PostFeedCard);
