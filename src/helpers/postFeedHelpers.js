import React from 'react';
import { getHtml } from '../post/Body';
import BodyShort from '../post/BodyShort';
import PostFeedEmbed from '../post/PostFeedEmbed';
import PostModalLink from '../post/PostModalLink';

const STARTWITHPERCENT = 5;

const getPositions = (text) => {
  const imgPos = text.indexOf('<img');
  const embedPos = text.indexOf('<iframe');
  const percentMultiplier = 100 / text.length;
  const firstEmbed = embedPos !== -1 ? embedPos * percentMultiplier : undefined;
  const firstImage = imgPos !== -1 ? imgPos * percentMultiplier : undefined;
  return { embed: firstEmbed, image: firstImage };
};

const postWithPicture = (tagPositions, searchPostion) => {
  const result = (tagPositions.image && tagPositions.image < searchPostion);
  if (tagPositions.embed !== undefined) {
    return (tagPositions.embed > tagPositions.image) && result;
  }
  return result;
};

const postWithAnEmbed = (tagPositions, searchPostion) => {
  const result = (tagPositions.embed && tagPositions.embed < searchPostion);
  if (tagPositions.image !== undefined) {
    return (tagPositions.image > tagPositions.embed) && result;
  }
  return result;
};

const postStartsWithAPicture = tagPositions => postWithPicture(tagPositions, STARTWITHPERCENT);
const postStartsWithAnEmbed = tagPositions => postWithAnEmbed(tagPositions, STARTWITHPERCENT);
const postWithPictureBeforeFirstHalf = tagPositions => postWithPicture(tagPositions, 50);
const postWithEmbedBeforeFirstHalf = tagPositions => postWithAnEmbed(tagPositions, 50);

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
export default function sortedBody(post, embeds, imagePath, openPostModal) {
  const htmlBody = getHtml(post.body);
  const preview = {
    text: () => (<div key="text" className="PostFeedCard__cell PostFeedCard__cell--text">
      <BodyShort body={post.body} />
    </div>),
    embed: () => (embeds && embeds[0]) && <PostFeedEmbed key="embed" post={post} />,
    image: () => imagePath && <div key="image" className="PostFeedCard__thumbs">
      <PostModalLink post={post} onClick={() => openPostModal(post.id)}>
        <img alt="post" key={imagePath} src={imagePath} />
      </PostModalLink>
    </div>
  };
  const tagPositions = getPositions(htmlBody);
  const feedBody = [];

  if (postStartsWithAPicture(tagPositions)) { // case 1
    feedBody.push(preview.image());
    feedBody.push(preview.text());
  } else if (postStartsWithAnEmbed(tagPositions)) { // case 2
    feedBody.push(preview.embed());
    feedBody.push(preview.text());
  } else if (postWithPictureBeforeFirstHalf(tagPositions)) { // case 4
    feedBody.push(preview.text());
    feedBody.push(preview.image());
  } else if (postWithEmbedBeforeFirstHalf(tagPositions)) { // case 5
    feedBody.push(preview.text());
    feedBody.push(preview.embed());
  } else { // case 3
    feedBody.push(preview.text());
  }
  return feedBody;
}
