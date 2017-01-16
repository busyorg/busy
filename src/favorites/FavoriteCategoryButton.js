import React from 'react';
import Icon from '../widgets/Icon';
import './FavoriteButton.scss';

const FavoriteCategoryButton = ({ children, onClick, isFavorited }) =>
  <a className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'} onClick={onClick}>
    { children }
    { children && ' ' }
    <Icon name={isFavorited ? 'star' : 'star_border'} sm />
  </a>;

export default FavoriteCategoryButton;
