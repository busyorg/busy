import React from 'react';
import numeral from 'numeral';
import { Link } from 'react-router';
import FavoriteButton from '../favorites/FavoriteButton';
import Icon from '../widgets/Icon';

const Tag = ({
  tag,
  removeCategoryFavorite,
  addCategoryFavorite,
  isFavorited
}) =>
  <div className="page">
    <div className="my-5 text-center">
      <h1>
        <Link to={`/hot/${tag.name}`}># {tag.name}</Link>{' '}
        <FavoriteButton
          name={tag.name}
          isFavorited={isFavorited}
          onClick={isFavorited
            ? () => removeCategoryFavorite(tag.name)
            : () => addCategoryFavorite(tag.name)
          }
        />
      </h1>
      <h2>
        <Icon name="library_books" lg /> {numeral(tag.comments).format('0,0')}{' '}
        <Icon name="attach_money" lg /> {numeral(tag.total_payouts).format('$0,0')}
      </h2>
    </div>
  </div>;

export default Tag;
