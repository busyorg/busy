import React from 'react';
import Icon from '../widgets/Icon';
import './FavoriteButton.scss';
import TooltipOrigin from '../app/TooltipOrigin';

const FavoriteCategoryButton = ({ children, onClick, isFavorited }) =>
  <TooltipOrigin
    content="Add in your favorites"
    active={!isFavorited}
  >
    <a
      className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'}
      onClick={onClick}
    >
      <Icon name={isFavorited ? 'star' : 'star_border'} sm />
      { children && ' ' }
      { children }
    </a>
  </TooltipOrigin>;

export default FavoriteCategoryButton;
