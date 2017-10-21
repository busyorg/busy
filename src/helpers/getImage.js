const getImage = path =>
  `${process.env.STORYBOOK_STEEMCONNECT_IMG_HOST || process.env.IMG_HOST}/${path}`;

export default getImage;
