import React from 'react';
import { has } from 'lodash';
import steemembed from 'steemembed';
import marked from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  sanitize: true,
  smartypants: true
});

export default (props) => {
  const embeds = steemembed.getAll(props.body);
  let body = props.body;
  body = marked(body);
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(props.jsonMetadata); } catch (e) { }

  if (has(jsonMetadata, 'image[0]')) {
    jsonMetadata.image.forEach((image) => {
      const newUrl = `https://img1.steemit.com/870x600/${image}`;
      body = body.replace(new RegExp(image, 'g'), newUrl);
      body = body.replace(new RegExp(`<a href="${newUrl}">${newUrl}</a>`, 'g'), `<img src="${newUrl}">`);
    });
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
