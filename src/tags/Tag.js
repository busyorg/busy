import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import FavoriteButton from '../favorites/FavoriteButton';

const Tag = ({ tag, favorited, addCategoryFavorite, removeCategoryFavorite }) =>
  (<div className="page">
    <div className="my-5 text-center">
      <h1>
        <Link to={`/hot/${tag.name}`}># {tag.name}</Link>{' '}
        <FavoriteButton
          name={tag.name}
          isFavorited={favorited}
          onClick={
            favorited
              ? () => {
                removeCategoryFavorite(tag.name);
              }
              : () => {
                addCategoryFavorite(tag.name);
              }
          }
        />
      </h1>
      <h2>
        <i className="iconfont icon-activity" /> {numeral(tag.comments).format('0,0')}{' '}
        <i className="iconfont icon-collection" /> {numeral(tag.total_payouts).format('$0,0')}
      </h2>
    </div>
  </div>);

Tag.propTypes = {
  tag: PropTypes.shape().isRequired,
  favorited: PropTypes.bool,
  addCategoryFavorite: PropTypes.func,
  removeCategoryFavorite: PropTypes.func,
};

Tag.defaultProps = {
  favorited: false,
  addCategoryFavorite: () => {},
  removeCategoryFavorite: () => {},
};

export default Tag;
