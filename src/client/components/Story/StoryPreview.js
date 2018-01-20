import React from 'react';
import PropTypes from 'prop-types';
import embedjs from 'embedjs';
import _ from 'lodash';
import PostFeedEmbed from './PostFeedEmbed';
import BodyShort from './BodyShort';
import { jsonParse } from '../../helpers/formatter';
import { image } from '../../vendor/steemitLinks';
import {
  getPositions,
  postWithPicture,
  postWithAnEmbed,
  isPostStartsWithAPicture,
  isPostStartsWithAnEmbed,
  isPostWithPictureBeforeFirstHalf,
  isPostWithEmbedBeforeFirstHalf,
} from './StoryHelper';
import { getHtml } from './Body';
import { getProxyImageURL } from '../../helpers/image';

const StoryPreview = ({ post }) => {
  const jsonMetadata = jsonParse(post.json_metadata);
  let imagePath = '';

  if (jsonMetadata.image && jsonMetadata.image[0]) {
    imagePath = getProxyImageURL(jsonMetadata.image[0], 'preview');
  } else {
    const bodyImg = post.body.match(image());
    if (bodyImg && bodyImg.length) {
      imagePath = getProxyImageURL(bodyImg[0], 'preview');
    }
  }

  const embeds = embedjs.getAll(post.body);
  const video = jsonMetadata.video;
  let hasVideo = false;
  if (_.has(video, 'content.videohash') && _.has(video, 'info.snaphash')) {
    const author = _.get(video, 'info.author', '');
    const permlink = _.get(video, 'info.permlink', '');
    const dTubeEmbedUrl = `https://emb.d.tube/#!/${author}/${permlink}/true`;
    const dTubeIFrame = `<iframe width="100%" height="340" src="${dTubeEmbedUrl}" allowFullScreen></iframe>`;
    hasVideo = true;
    embeds[0] = {
      type: 'video',
      provider_name: 'DTube',
      embed: dTubeIFrame,
      thumbnail: getProxyImageURL(`https://ipfs.io/ipfs/${video.info.snaphash}`, 'preview'),
    };
  }

  const preview = {
    text: () => <BodyShort key="text" className="Story__content__body" body={post.body} />,

    embed: () => embeds && embeds[0] && <PostFeedEmbed key="embed" embed={embeds[0]} />,

    image: () => (
      <div key={imagePath} className="Story__content__img-container">
        <img alt="" src={imagePath} />
      </div>
    ),
  };

  const htmlBody = getHtml(post.body, {}, 'text');
  const tagPositions = getPositions(htmlBody);
  const bodyData = [];

  if (hasVideo) {
    bodyData.push(preview.embed());
    bodyData.push(preview.text());
  } else if (htmlBody.length <= 1500 && postWithPicture(tagPositions, 100)) {
    bodyData.push(preview.image());
    bodyData.push(preview.text());
  } else if (htmlBody.length <= 1500 && postWithAnEmbed(tagPositions, 100)) {
    bodyData.push(preview.embed());
    bodyData.push(preview.text());
  } else if (isPostStartsWithAPicture(tagPositions)) {
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
  } else if (imagePath !== '') {
    bodyData.push(preview.text());
    bodyData.push(preview.image());
  } else {
    bodyData.push(preview.text());
  }

  return <div>{bodyData}</div>;
};

StoryPreview.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default StoryPreview;
