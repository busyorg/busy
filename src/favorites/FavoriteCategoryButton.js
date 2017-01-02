import React from 'react';
import Icon from '../widgets/Icon';

const FavoriteCategoryButton = ({ children, onClick, isFavorited }) =>
  <a onClick={onClick}>
    <Icon name={isFavorited ? 'star' : 'star_border'} sm />{ ' ' }
    { children }
  </a>

export default FavoriteCategoryButton;
