import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import sanitizeHtml from 'sanitize-html';
import Remarkable from 'remarkable';
import embedjs from 'embedjs';
import { jsonParse } from '../../helpers/formatter';
import sanitizeConfig from '../../vendor/SanitizeConfig';
import { imageRegex, dtubeImageRegex, rewriteRegex } from '../../helpers/regexHelpers';
import htmlReady from '../../vendor/steemitHtmlReady';
import improve from '../../helpers/improve';
import PostFeedEmbed from './PostFeedEmbed';
import './Body.less';

export const remarkable = new Remarkable({
  html: true, // Remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’',
});

const getEmbed = link => {
  const embed = embedjs.get(link, { width: '100%', height: 400, autoplay: false });

  if (_.isUndefined(embed)) {
    return {
      provider_name: '',
      thumbnail: '',
      embed: link,
    };
  }

  return embed;
};

// Should return text(html) if returnType is text
// Should return Object(React Compatible) if returnType is Object
export function getHtml(body, jsonMetadata = {}, returnType = 'Object', options = {}) {
  const parsedJsonMetadata = jsonParse(jsonMetadata) || {};
  parsedJsonMetadata.image = parsedJsonMetadata.image || [];

  let parsedBody = body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

  parsedBody.replace(imageRegex, img => {
    if (_.filter(parsedJsonMetadata.image, i => i.indexOf(img) !== -1).length === 0) {
      parsedJsonMetadata.image.push(img);
    }
  });

  parsedBody = improve(parsedBody);
  parsedBody = remarkable.render(parsedBody);

  const htmlReadyOptions = { mutate: true, resolveIframe: returnType === 'text' };
  parsedBody = htmlReady(parsedBody, htmlReadyOptions).html;
  parsedBody = parsedBody.replace(dtubeImageRegex, '');

  if (options.rewriteLinks) {
    parsedBody = parsedBody.replace(rewriteRegex, (match, p1) => `"${p1 || '/'}"`);
  }

  parsedBody = sanitizeHtml(
    parsedBody,
    sanitizeConfig({
      secureLinks: options.secureLinks,
    }),
  );
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
      const embed = getEmbed(link);
      sections.push(
        ReactDOMServer.renderToString(<PostFeedEmbed key={`embed-a-${i}`} inPost embed={embed} />),
      );
      section = section.substring(`${id} ${type} ${link} ~~~`.length);
    }
    if (section !== '') {
      sections.push(section);
    }
  }
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: sections.join('') }} />;
}

const Body = props => {
  const options = {
    rewriteLinks: props.rewriteLinks,
    secureLinks: props.exitPageSetting,
  };
  const htmlSections = getHtml(props.body, props.jsonMetadata, 'Object', options);
  return <div className={classNames('Body', { 'Body--full': props.full })}>{htmlSections}</div>;
};

Body.propTypes = {
  body: PropTypes.string,
  jsonMetadata: PropTypes.string,
  full: PropTypes.bool,
  rewriteLinks: PropTypes.bool,
  exitPageSetting: PropTypes.bool,
};

Body.defaultProps = {
  body: '',
  jsonMetadata: '',
  full: false,
  rewriteLinks: false,
  exitPageSetting: true,
};

export default Body;
