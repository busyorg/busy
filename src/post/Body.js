import React from 'react';
import _ from 'lodash';
import steemembed from 'steemembed';
import sanitizeHtml from 'sanitize-html';
import Remarkable from 'remarkable';

import sanitizeConfig from '../helpers/SanitizeConfig';
import { replaceAll, escapeRegExp, imageRegex, linkify } from '../helpers/regexHelpers';

const remarkable = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: true, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’'
});

export default (props) => {
  const embeds = steemembed.getAll(props.body);
  let body = props.body;
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(props.jsonMetadata); } catch (e) { }
  jsonMetadata.image = jsonMetadata.image || [];

  body = body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

  body.replace(imageRegex, (img) => {
    if (_.filter(jsonMetadata.image, i => i.indexOf(img) !== -1).length === 0) {
      jsonMetadata.image.push(img);
    }
  });

  body = linkify(body);

  if (_.has(embeds, '[0].embed')) {
    embeds.forEach((embed) => { body = body.replace(embed.url, embed.embed); });
  }

  body = remarkable.render(body);

  if (_.has(jsonMetadata, 'image[0]')) {
    jsonMetadata.image.forEach((image) => {
      let newUrl = image;
      if (/^\/\//.test(image)) { newUrl = `https:${image}`; }

      body = replaceAll(body, `<a href="${image}">${image}</a>`, `<img src="${newUrl}">`);
      // not in img tag
      if (body.search(`<img[^>]+src="${escapeRegExp(image)}"`) === -1) {
        body = replaceAll(body, image, `<img src="${newUrl}">`);
      }
    });
  }

  body.replace(/<img[^>]+src="([^">]+)"/ig, (img, ...rest) => {
    if (rest.length && rest[0] && rest[0].indexOf('https://steemitimages.com/0x0/') !== 0) {
      const newUrl = `https://steemitimages.com/0x0/${rest[0]}`;
      body = replaceAll(body, rest[0], newUrl);
    }
  });

  body = sanitizeHtml(body, sanitizeConfig({}));

  return <div dangerouslySetInnerHTML={{ __html: body }} />;
};
