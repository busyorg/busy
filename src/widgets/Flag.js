import React from 'react';
import franc from 'franc';
import striptags from 'striptags';
import marked from 'marked';
import { Link } from 'react-router';

import { getCountryCode } from '../helpers/languages';

import './Flag.scss';

export default ({ title, body, className }) => {
  const language = franc(`${title} ${striptags(marked(body))}`);
  const textLength = (`${title} ${striptags(marked(body))}`).length;
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
