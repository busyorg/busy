/* eslint-disable no-useless-escape */

import React from 'react';
import _ from 'lodash';
import steemembed from 'steemembed';
import sanitizeHtml from 'sanitize-html';
import Remarkable from 'remarkable';

import sanitizeConfig from './../helpers/SanitizeConfig';

const remarkable = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: true, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’'
});

function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

export default (props) => {
  const embeds = steemembed.getAll(props.body);
  let body = props.body;
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(props.jsonMetadata); } catch (e) { }
  jsonMetadata.image = jsonMetadata.image || [];

  body = body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

  const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/ig;

  body.replace(imageRegex, (img) => {
    if (_.filter(jsonMetadata.image, i => i.indexOf(img) !== -1).length === 0) {
      jsonMetadata.image.push(img);
    }
  });

  if (_.has(jsonMetadata, 'users[0]')) {
    body = body.replace(/(^|\s)(@[-.a-z\d]+)/ig, (user) => {
      const space = /^\s/.test(user) ? user[0] : '';
      user = user.trim().substring(1);
      return `${space}<a href="/@${user}">@${user}</a>`;
    });
  }

  if (_.has(embeds, '[0].embed')) {
    embeds.forEach((embed) => { body = body.replace(embed.url, embed.embed); });
  }

  body = remarkable.render(body);

  if (_.has(jsonMetadata, 'image[0]')) {
    jsonMetadata.image.forEach((image) => {
      let newUrl = image;
      if (/^\/\//.test(image)) { newUrl = `https:${image}`; }

      body = body.replace(new RegExp(`<a href="${image}">${image}</a>`, 'g'), `<img src="${newUrl}">`);
      // not in img tag

      if (body.search(`<img[^>]+src="${image}"`) === -1) {
        body = body.replace(new RegExp(image, 'g'), `<img src="${newUrl}">`);
      }
    });
  }

  body.replace(/<img[^>]+src="([^">]+)"/ig, (img, ...rest) => {
    if (rest.length && rest[0]) {
      const newUrl = `https://img1.steemit.com/0x0/${rest[0]}`;
      body = body.replace(new RegExp(escapeRegExp(rest[0]), 'g'), newUrl);
    }
  });

  body = sanitizeHtml(body, sanitizeConfig({}));

  return <div dangerouslySetInnerHTML={{ __html: body }} />;
};
