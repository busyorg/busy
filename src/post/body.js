import React from 'react';
import { has } from 'lodash';
import steemembed from 'steemembed';
import sanitizeHtml from 'sanitize-html';
import marked from 'marked';

const sanitizeConfig = {
  allowedTags: `
    div, iframe, del,
    a, p, b, q, br, ul, li, ol, img, h1, h2, h3, h4, h5, h6, hr,
    blockquote, pre, code, em, strong, center, table, thead, tbody, tr, th, td,
    strike, sup, sub`.trim().split(/,\s*/)
};

export default (props) => {
  const embeds = steemembed.getAll(props.body);
  let body = props.body;
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(props.jsonMetadata); } catch (e) { }

  body = body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

  if (has(jsonMetadata, 'users[0]')) {
    body = body.replace(/(^|\s)(@[-.a-z\d]+)/ig, (user) => {
      const space = /^\s/.test(user) ? user[0] : '';
      user = user.trim().substring(1);
      return `${space}<a href="/@${user}">@${user}</a>`;
    });
  }

  body = marked(body);

  if (has(jsonMetadata, 'image[0]')) {
    jsonMetadata.image.forEach((image) => {
      const newUrl = `https://img1.steemit.com/870x600/${image}`;
      body = body.replace(new RegExp(image, 'g'), newUrl);
      body = body.replace(new RegExp(`<a href="${newUrl}">${newUrl}</a>`, 'g'), `<img src="${newUrl}">`);
    });
  }

  body = sanitizeHtml(body, sanitizeConfig);

  return (
    <div>
      {has(embeds, '[0].embed') &&
        <div className="thumbs">
          <div dangerouslySetInnerHTML={{ __html: embeds[0].embed }} />
        </div>}
      <span dangerouslySetInnerHTML={{ __html: body }} />
    </div>);
};
