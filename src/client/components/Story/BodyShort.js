import React from 'react';
import PropTypes from 'prop-types';
import ellipsis from 'text-ellipsis';
import striptags from 'striptags';
import Remarkable from 'remarkable';

const remarkable = new Remarkable({ html: true });

function decodeEntities(body) {
  return body.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

const BodyShort = props => {
  let body = striptags(remarkable.render(striptags(decodeEntities(props.body))));
  body = body.replace(/(?:https?|ftp):\/\/[\S]+/g, '');

  // If body consists of whitespace characters only skip it.
  if (!body.replace(/\s/g, '').length) {
    return null;
  }

  /* eslint-disable react/no-danger */
  return (
    <div
      className={props.className}
      dangerouslySetInnerHTML={{ __html: ellipsis(body, props.length, { ellipsis: '…' }) }}
    />
  );
  /* eslint-enable react/no-danger */
};

BodyShort.propTypes = {
  className: PropTypes.string,
  body: PropTypes.string,
  length: PropTypes.number,
};

BodyShort.defaultProps = {
  className: '',
  body: '',
  length: 140,
};

export default BodyShort;
