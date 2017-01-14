import React from 'react';
import Icon from '../widgets/Icon';
import './FavoriteButton.scss';

const FavoriteUserButton = ({ onClick, isFavorited }) =>
  <a className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'} onClick={onClick}>
    <Icon name={isFavorited ? 'star' : 'star_border'} sm />
    { ' ' }
  </a>;

export default FavoriteUserButton;
