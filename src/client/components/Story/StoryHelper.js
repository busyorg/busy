import _ from 'lodash';
import { jsonParse } from '../../helpers/formatter';
import { getHtml } from './Body';

const START_WITH_PERCENT = 5;

const getPositions = text => {
  const imgPos = text.indexOf('<img');
  const embedPos = text.indexOf('<iframe');
  const percentMultiplier = 100 / text.length;
  const firstEmbed = embedPos !== -1 ? embedPos * percentMultiplier : undefined;
  const firstImage = imgPos !== -1 ? imgPos * percentMultiplier : undefined;
  return { embed: firstEmbed, image: firstImage };
};

const postWithPicture = (tagPositions, searchPosition) => {
  const result = tagPositions.image && tagPositions.image < searchPosition;
  if (tagPositions.embed !== undefined) {
    return tagPositions.embed > tagPositions.image && result;
  }
  return result;
};

const postWithAnEmbed = (tagPositions, searchPosition) => {
  const result = tagPositions.embed && tagPositions.embed < searchPosition;
  if (tagPositions.image !== undefined) {
    return tagPositions.image > tagPositions.embed && result;
  }
  return result;
};

const isPostStartsWithAPicture = tagPositions => postWithPicture(tagPositions, START_WITH_PERCENT);
const isPostStartsWithAnEmbed = tagPositions => postWithAnEmbed(tagPositions, START_WITH_PERCENT);
const isPostWithPictureBeforeFirstHalf = tagPositions => postWithPicture(tagPositions, 50);
const isPostWithEmbedBeforeFirstHalf = tagPositions => postWithAnEmbed(tagPositions, 50);

const postHasVideo = post => {
  const jsonMetadata = jsonParse(post.json_metadata);
  const video = _.get(jsonMetadata, 'video', {});
  const htmlBody = getHtml(post.body, {}, 'text');
  const tagPositions = getPositions(htmlBody);
  let hasVideo = false;

  if (_.has(video, 'content.videohash') && _.has(video, 'info.snaphash')) {
    hasVideo = true;
  } else if (htmlBody.length <= 1500 && postWithPicture(tagPositions, 100)) {
    hasVideo = false;
  } else if (htmlBody.length <= 1500 && postWithAnEmbed(tagPositions, 100)) {
    hasVideo = true;
  } else if (isPostStartsWithAPicture(tagPositions)) {
    hasVideo = false;
  } else if (isPostStartsWithAnEmbed(tagPositions)) {
    return true;
  } else if (isPostWithPictureBeforeFirstHalf(tagPositions)) {
    hasVideo = false;
  } else if (isPostWithEmbedBeforeFirstHalf(tagPositions)) {
    hasVideo = true;
  }

  return hasVideo;
};

export {
  getPositions,
  postWithPicture,
  postWithAnEmbed,
  postHasVideo,
  isPostStartsWithAPicture,
  isPostStartsWithAnEmbed,
  isPostWithPictureBeforeFirstHalf,
  isPostWithEmbedBeforeFirstHalf,
};
