import React from 'react';
import ellipsis from 'text-ellipsis';
import striptags from 'striptags';
import Remarkable from 'remarkable';

const remarkable = new Remarkable({ html: true });

function decodeEntities(body) {
  return body.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

const BodyShort = (props) => {
  let body = striptags(remarkable.render(decodeEntities(props.body)));
  body = body.replace(/(?:https?|ftp):\/\/[\S]+/g, '');
  return (<span>
    <span dangerouslySetInnerHTML={{ __html: ellipsis(body, 140, { ellipsis: '…' }) }} />
  </span>);
};

export default BodyShort;
