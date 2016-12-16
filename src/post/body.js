import React from 'react';
import { has } from 'lodash';
import steemembed from 'steemembed';
import striptags from 'striptags';
import marked from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  sanitize: true,
  smartypants: true
});

export default (props) => {
  const embeds = steemembed.getAll(props.body);
  let body = props.body;
  // body = striptags(remarkable.render(body), ['a', 'p', 'h1', 'h2', 'h3', 'img', 'code', 'pre']);
  // body = striptags(remarkable.render(body), ['a', 'p', 'h1', 'h2', 'h3', 'img', 'code', 'pre']);
  // body = remarkable.render(body);
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(props.jsonMetadata); } catch (e) { }

  if (jsonMetadata.format === 'markdown') {
    body = marked(body);
    if (has(jsonMetadata, 'image[0]')) {
      jsonMetadata.image.forEach((image) => {
        const newUrl = `https://img1.steemit.com/870x600/${image}`;
        body = body.replace(new RegExp(image, 'g'), newUrl);
        body = body.replace(new RegExp(`<a href="${newUrl}">${newUrl}</a>`, 'g'), `<img src="${newUrl}">`);
      });
    }
    if (has(jsonMetadata, 'users[0]')) {
      body = body.replace(/(^|\s)(@[-.a-z\d]+)/ig, (user) => {
        const space = /^\s/.test(user) ? user[0] : '';
        user = user.trim().substring(1);
        return `${space}<a href="/@${user}">@${user}</a>`;
      });
    }
  } else {
    // format html.
    body = marked(body, { sanitize: false });
    // body = striptags(marked(body, { sanitize: false }),
    //   ['a', 'b', 'p', 'h1', 'h2', 'h3', 'img', 'code', 'pre']);
  }

  return (
    <div>
      {has(embeds, '[0].embed') &&
        <div className="thumbs">
          <div dangerouslySetInnerHTML={{ __html: embeds[0].embed }} />
        </div>}
      <span dangerouslySetInnerHTML={{ __html: body }} />
    </div>);
};
