import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import USDDisplay from '../components/Utils/USDDisplay';
import FavoriteButton from '../components/FavoriteButton';

const Tag = ({ tag, favorited, addCategoryFavorite, removeCategoryFavorite }) => (
  <div className="page">
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
        <i className="iconfont icon-activity" /> <FormattedNumber value={tag.comments} />{' '}
        <i className="iconfont icon-collection" /> <USDDisplay value={tag.total_payouts} />
      </h2>
    </div>
  </div>
);

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
