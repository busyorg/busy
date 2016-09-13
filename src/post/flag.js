import React from 'react';
import franc from 'franc';
import striptags from 'striptags';
import marked from 'marked';
import { Link } from 'react-router';

import { getCountryCode } from './../helpers/languages';

export default ({ title, body }) => {
  const language = franc(title + ' ' + striptags(marked(body)));
  const textLength = (title + ' ' + striptags(marked(body))).length;

  if ( !(language != 'eng' && language != 'sco' && textLength > 255) ) {
    return null;
  }

  return (
    <span>
      <Link to={ '/hot/' + getCountryCode(language) }>
        <img className="flag" alt={ language } src={ '/img/flag/' + getCountryCode(language) + '.svg' }/>
      </Link>
    </span>
  );
};
