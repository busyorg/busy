import React from 'react';
import franc from 'franc';
import striptags from 'striptags';
import Remarkable from 'remarkable';
import { Link } from 'react-router-dom';

import './Flag.less';
import { getCountryCode } from '../helpers/languages';

const remarkable = new Remarkable({ html: true });

export default ({ title, body, className }) => {
  const language = franc(`${title} ${striptags(remarkable.render(body))}`);
  const textLength = (`${title} ${striptags(remarkable.render(body))}`).length;
  if (!(language !== 'eng' && language !== 'sco' && textLength > 255)) {
    return null;
  }
  return (
    <span className={className}>
      <Link to={`/hot/${getCountryCode(language)}`}>
        <img className="Flag" alt={language} src={`/img/flag/${getCountryCode(language)}.svg`} />
      </Link>
    </span>
  );
};
