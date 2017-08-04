import React, { PropTypes } from 'react';
import _ from 'lodash';
import sanitizeHtml from 'sanitize-html';
import Remarkable from 'remarkable';
import embedjs from 'embedjs';
import { jsonParse } from '../../helpers/formatter';
import sanitizeConfig from '../../helpers/SanitizeConfig';
import { imageRegex } from '../../helpers/regexHelpers';
import htmlReady from '../../helpers/steemitHtmlReady';
import PostFeedEmbed from './PostFeedEmbed';
import './Body.less';

const remarkable = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’',
});

// Should return text(html) if returnType is text
// Should return Object(React Compatible) if returnType is Object
export function getHtml(body, jsonMetadata = {}, returnType = 'Object') {
  const parsedJsonMetadata = jsonParse(jsonMetadata) || {};
  parsedJsonMetadata.image = parsedJsonMetadata.image || [];

  let parsedBody = body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

  parsedBody.replace(imageRegex, (img) => {
    if (_.filter(parsedJsonMetadata.image, i => i.indexOf(img) !== -1).length === 0) {
      parsedJsonMetadata.image.push(img);
    }
  });

  const htmlReadyOptions = { mutate: true, resolveIframe: returnType === 'text' };
  parsedBody = remarkable.render(parsedBody);
  parsedBody = htmlReady(parsedBody, htmlReadyOptions).html;
  parsedBody = sanitizeHtml(parsedBody, sanitizeConfig({}));
  if (returnType === 'text') {
    return parsedBody;
  }

  const sections = [];

  const splittedBody = parsedBody.split('~~~ embed:');
  for (let i = 0; i < splittedBody.length; i += 1) {
    let section = splittedBody[i];

    const match = section.match(/^([A-Za-z0-9_-]+) ([A-Za-z]+) (\S+) ~~~/);
    if (match && match.length >= 4) {
      const id = match[1];
      const type = match[2];
      const link = match[3];
      const embed = embedjs.get(link, { width: '100%', height: 400, autoplay: true });
      sections.push(<PostFeedEmbed key={`embed-a-${i}`} embed={embed} />);
      section = section.substring(`${id} ${type} ${link} ~~~`.length);
    }
    if (section !== '') {
      // eslint-disable-next-line react/no-danger
      sections.push(<div key={`embed-b-${i}`} dangerouslySetInnerHTML={{ __html: section }} />);
    }
  }
  return sections;
}

const Body = (props) => {
  const htmlSections = getHtml(props.body, props.jsonMetadata);
  return (
    <div className="Body">
      {htmlSections}
    </div>
  );
};

Body.propTypes = {
  body: PropTypes.string,
  jsonMetadata: PropTypes.string,
};

Body.defaultProps = {
  body: '',
  jsonMetadata: '',
};

export default Body;
