import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage, FormattedRelative, injectIntl } from 'react-intl';
import _ from 'lodash';
import numeral from 'numeral';
import BookmarkButton from '../../bookmarks/BookmarkButton';
import BodyShort from '../BodyShort';
import { getHtml } from '../Body';
import Comments from '../../comments/Comments';
import PostActionButtons from '../PostActionButtons';
import Icon from '../../widgets/Icon';
import Avatar from '../../widgets/Avatar';
import PostModalLink from './../PostModalLink';
import LikesList from './../LikesList';
import { ProfileTooltipOrigin } from '../../widgets/tooltip/ProfileTooltip';
import Reactions from '../Reactions';
import { calculatePayout } from '../../helpers/steemitHelpers';
import PostFeedEmbed from '../PostFeedEmbed';
import './PostFeedCard.scss';

const STARTWITHPERCENT = 5;
const AmountWithLabel = ({ label, amount }) => (
  _.isNumber(amount)
    ? <div>{label}: {numeral(amount).format('$0,0.00')}</div>
    : null
);

const getPositionsForFirstHalf = (text) => {
  const imgPos = text.indexOf('<img');
  const embedPos = text.indexOf('<iframe');
  const percentMultiplier = 100 / text.length;
  const firstEmbed = embedPos !== -1 ? embedPos * percentMultiplier : undefined;
  const firstImage = imgPos !== -1 ? imgPos * percentMultiplier : undefined;

  // since we care for post in first half only
  const embedInFirstHalf = firstEmbed > 50 ? undefined : firstEmbed;
  const imageInFirstHalf = firstImage > 50 ? undefined : firstImage;
  let entitiyInFirstHalf;

  if (embedInFirstHalf && imageInFirstHalf) {
    entitiyInFirstHalf = (imageInFirstHalf < embedInFirstHalf) ? 'image' : 'embed';
  } else if (imageInFirstHalf) {
    entitiyInFirstHalf = 'image';
  } else if (embedInFirstHalf) {
    entitiyInFirstHalf = 'embed';
  }

  return { embed: firstEmbed, image: firstImage, entitiyInFirstHalf };
};

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


// Case 1: Post start with a picture
// 1. Title
// 2. Picture
// 3. Text preview

// Case 2: Post start with an embed
// When post start with an embed we should show on PostFeedCard elements on this order
// 1: Title
// 2: Embed
// 3: Text preview

// Case 3: Post have one image or embed on bottom of the post
// When there is no embed or picture on the first half of the post we should not show any preview
// picture/embed on PostFeedCard but show only title and text preview
// 1: Title
// 2: Text preview

// Case 4: Post start with text then there is a picture before the second half of the post
// 1: Title
// 2: Text preview
// 3: Picture

// Case 5: Post start with text then there is an embed before the second half of the post
// 1: Title
// 2: Text preview
// 3: Embed

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
  showPayout,
  handleShowCommentsRequest,
  handleShowLikesRequest,
  handleShowPayoutRequest,
  layout,
  intl,
}) => {
  const isReplyPost = !!post.parent_author;
  const htmlBody = getHtml(post.body);
  const preview = {
    text: () => (<div className="PostFeedCard__cell PostFeedCard__cell--body">
      <BodyShort body={post.body} />
    </div>),
    embed: () => (embeds && embeds[0]) && <PostFeedEmbed post={post} />,
    image: () => imagePath && <div className="PostFeedCard__thumbs">
      <PostModalLink post={post} onClick={() => openPostModal(post.id)}>
        <img alt="post" key={imagePath} src={imagePath} />
      </PostModalLink>
    </div>
  };
  const tagPositions = getPositionsForFirstHalf(htmlBody);
  const bodyData = [];

  // For case 1,2,4,5
  if (tagPositions.entitiyInFirstHalf) {
    const firstElement = tagPositions.entitiyInFirstHalf;
    // For case 1,2
    if (tagPositions[firstElement] < STARTWITHPERCENT) {
      bodyData.push(preview[firstElement]());
      bodyData.push(preview.text());
    } else { // For case 4,5
      bodyData.push(preview.text());
      bodyData.push(preview[firstElement]());
    }
  } else {
    // For case 3
    bodyData.push(preview.text());
  }

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
            <FormattedRelative value={post.created} />{' '}
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
          <PostModalLink
            post={post}
            onClick={() => openPostModal(post.id)}
          >
            {post.title}
          </PostModalLink>
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
