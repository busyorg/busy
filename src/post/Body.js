import React from 'react';
import _ from 'lodash';
import embedjs from 'embedjs';
import sanitizeHtml from 'sanitize-html';
import Remarkable from 'remarkable';
import emojione from 'emojione';
import xmldom from 'xmldom';

import sanitizeConfig from '../helpers/SanitizeConfig';
import { replaceAll, escapeRegExp, imageRegex, linkify } from '../helpers/regexHelpers';


const noop = () => { };
const DOMParser = new xmldom.DOMParser({
  errorHandler: { warning: noop, error: noop }
});
const XMLSerializer = new xmldom.XMLSerializer();

const remarkable = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: true, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’'
});

export default (props) => {
  const embeds = embedjs.getAll(props.body);
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

  body = remarkable.render(body);

  if (_.has(jsonMetadata, 'image[0]')) {
    jsonMetadata.image.forEach((image) => {
      let newUrl = image;
      if (/^\/\//.test(image)) { newUrl = `https:${image}`; }
      body = replaceAll(body, `<a href="${image}">${image}</a>`, `<img src="${newUrl}">`);

      // not in any tag
      if (body.search(`<[^>]+=([\\s"'])?${escapeRegExp(image)}(["'])?`) === -1) {
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

  const bodyDoc = DOMParser.parseFromString(body);
  body = XMLSerializer.serializeToString(bodyDoc);

  if (_.has(embeds, '[0].embed')) {
    embeds.forEach((embed) => {
      body = replaceAll(body, `<a href="${embed.url}">${embed.url}</a>`, embed.embed);

      if (body.search(`<[^>]+=([\\s"'])?${embed.url}(["'])?`) === -1) {
        body = replaceAll(body, embed.url, embed.embed);
      }
    });
  }

  body = sanitizeHtml(body, sanitizeConfig({}));
  const bodyWithEmojis = emojione.shortnameToImage(body);

  return <div dangerouslySetInnerHTML={{ __html: bodyWithEmojis }} />;
};
