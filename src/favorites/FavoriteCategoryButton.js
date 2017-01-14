import React from 'react';
import Icon from '../widgets/Icon';
import './FavoriteButton.scss';

const FavoriteCategoryButton = ({ children, onClick, isFavorited }) =>
  <a className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'} onClick={onClick}>
    <Icon name={isFavorited ? 'star' : 'star_border'} sm />
    { children && ' ' }
    { children }
  </a>;

export default FavoriteCategoryButton;
