import React from 'react';
import Icon from '../widgets/Icon';
import TooltipOrigin from '../app/TooltipOrigin';
import './FavoriteButton.scss';

const FavoriteUserButton = ({ onClick, isFavorited }) =>
  <TooltipOrigin
    content="Add in your favorites"
    active={!isFavorited}
  >
    <a
      className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'}
      onClick={onClick}
    >
      <Icon name={isFavorited ? 'star' : 'star_border'} sm />
      { ' ' }
    </a>
  </TooltipOrigin>;

export default FavoriteUserButton;
