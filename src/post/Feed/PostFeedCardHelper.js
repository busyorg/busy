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

const isPostStartsWithAPicture = tagPositions => postWithPicture(tagPositions, STARTWITHPERCENT);
const isPostStartsWithAnEmbed = tagPositions => postWithAnEmbed(tagPositions, STARTWITHPERCENT);
const isPostWithPictureBeforeFirstHalf = tagPositions => postWithPicture(tagPositions, 50);
const isPostWithEmbedBeforeFirstHalf = tagPositions => postWithAnEmbed(tagPositions, 50);

export {
  getPositions,
  isPostStartsWithAPicture,
  isPostStartsWithAnEmbed,
  isPostWithPictureBeforeFirstHalf,
  isPostWithEmbedBeforeFirstHalf
};
