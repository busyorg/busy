import React from 'react';
import { getHtml } from '../Body';
import BodyShort from '../BodyShort';
import PostFeedEmbed from '../PostFeedEmbed';
import PostModalLink from './../PostModalLink';

const STARTWITHPERCENT = 5;

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
  return bodyData;
}
