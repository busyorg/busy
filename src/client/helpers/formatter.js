export const jsonParse = str => {
  try {
    return jsonParse(JSON.parse(str));
  } catch (e) {
    return str;
  }
};

export function postSummary(post, author) {
  let formattedPost = post.substring(0, 140);
  if (post.length > 140) formattedPost += '...';
  formattedPost += ` by ${author}`;
  return formattedPost;
}

export const epochToUTC = epochTimestamp => new Date(0).setUTCSeconds(epochTimestamp);

export default jsonParse;
