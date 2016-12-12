import React from 'react';
import numeral from 'numeral';
import { Link } from 'react-router';

import Icon from '../widgets/Icon';

const Tag = ({
  tag,
}) =>
  <div className="page">
    <center className="my-3">
      <h1>
        <Link to={`/hot/${tag.name}`}>#{tag.name}</Link>{' '}
      </h1>
      <h2>
        <Icon name="library_books" lg /> {numeral(tag.comments).format('0,0')}{' '}
        <Icon name="attach_money" lg /> {numeral(tag.total_payouts).format('$0,0')}
      </h2>
    </center>
  </div>;

export default Tag;
