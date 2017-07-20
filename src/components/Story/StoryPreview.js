import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import embedjs from 'embedjs';
import PostFeedEmbed from './PostFeedEmbed';
import BodyShort from './BodyShort';
import { jsonParse } from '../../helpers/formatter';
import { image } from '../../helpers/steemitLinks';
import {
  getPositions,
  isPostStartsWithAPicture,
  isPostStartsWithAnEmbed,
  isPostWithPictureBeforeFirstHalf,
  isPostWithEmbedBeforeFirstHalf,
} from '../../post/Feed/PostFeedCardHelper';
import { getHtml } from '../../post/Body';

const StoryPreview = ({ post }) => {
  const jsonMetadata = jsonParse(post.json_metadata);
  let imagePath = '';

  if (jsonMetadata.image && jsonMetadata.image[0]) {
    imagePath = `https://steemitimages.com/600x800/${jsonMetadata.image[0]}`;
  } else {
    const bodyImg = post.body.match(image());
    if (bodyImg && bodyImg.length) {
      imagePath = `https://steemitimages.com/600x800/${bodyImg[0]}`;
    }
  }

  const embeds = embedjs.getAll(post.body);

  const preview = {
    text: () => (
      <div key="text" className="Story__content__body">
        <BodyShort body={post.body} />
      </div>),

    embed: () => embeds && embeds[0] && <PostFeedEmbed key="embed" embed={embeds[0]} />,

    image: () => <img alt="post" key={imagePath} src={imagePath} />,
  };

  const htmlBody = getHtml(post.body, {}, 'text');
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

  return (
    <div>
      {bodyData}
    </div>
  );
};

StoryPreview.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default StoryPreview;
