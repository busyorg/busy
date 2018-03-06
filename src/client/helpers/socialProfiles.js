const socialTransformers = {
  facebook: id => `https://facebook.com/${id}`,
  twitter: id => `https://twitter.com/${id}`,
  youtube: id => `https://www.youtube.com/user/${id}`,
  instagram: id => `https://instagram.com/${id}`,
  github: id => `https://github.com/${id}`,
  bitcoin: id => `https://blockchain.info/address/${id}`,
  ethereum: id => `https://etherscan.io/address/${id}`,
};

export const transform = (socialId, id) => socialTransformers[socialId](id);

export const getFacebookShareURL = url => `https://facebook.com/sharer/sharer.php?u=${url}`;
export const getTwitterShareURL = (text, url) =>
  `https://twitter.com/intent/tweet/?text=${text}&url=${url}`;

export default [
  { id: 'facebook', icon: 'facebook', color: '#3b5998', name: 'Facebook' },
  { id: 'twitter', icon: 'twitter', color: '#00aced', name: 'Twitter' },
  { id: 'youtube', icon: 'youtube', color: '#ff0202', name: 'YouTube' },
  { id: 'instagram', icon: 'instagram', color: '#8a3ab9', name: 'Instagram' },
  { id: 'github', icon: 'github', color: 'black', name: 'GitHub' },
  { id: 'bitcoin', icon: 'bitcoin', color: '#ff9900', name: 'Bitcoin' },
  { id: 'ethereum', icon: 'ethereum', color: '#3c3c3d', name: 'Ethereum' },
];
