const IMG_PROXY_PREFIX = '//res.cloudinary.com/hpiynhbhq/image/fetch/w_720,c_limit/';
const IMG_PROXY_PREVIEW_PREFIX = '//res.cloudinary.com/hpiynhbhq/image/fetch/w_600,h_800,c_limit/';
const IMG_PROXY_BACK = 'https://steemitimages.com/600x800/';

export const getProxyImageURL = (url, type) => {
  if (url.length > 256) {
    return `${IMG_PROXY_BACK}${url}`;
  } else if (type === 'preview') {
    return `${IMG_PROXY_PREVIEW_PREFIX}${url}`;
  }
  return `${IMG_PROXY_PREFIX}${url}`;
};

export default null;
