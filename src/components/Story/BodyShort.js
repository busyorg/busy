import React from 'react';
import PropTypes from 'prop-types';
import ellipsis from 'text-ellipsis';
import striptags from 'striptags';
import Remarkable from 'remarkable';

const remarkable = new Remarkable({ html: true });

function decodeEntities(body) {
  return body.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

const BodyShort = (props) => {
  let body = striptags(remarkable.render(striptags(decodeEntities(props.body))));
  body = body.replace(/(?:https?|ftp):\/\/[\S]+/g, '');
  /* eslint-disable react/no-danger */
  return (
    <span>
      <span dangerouslySetInnerHTML={{ __html: ellipsis(body, props.length, { ellipsis: '…' }) }} />
    </span>
  );
  /* eslint-enable react/no-danger */
};

BodyShort.propTypes = {
  body: PropTypes.string,
  length: PropTypes.number,
};

BodyShort.defaultProps = { body: '', length: 140 };

export default BodyShort;
