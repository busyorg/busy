import React from 'react';
import Icon from '../widgets/Icon';

const FavoriteCategoryButton = ({ name, onClick, isFavorited, noTitle }) => (
  <a onClick={onClick}>
    <Icon name={isFavorited ? 'star' : 'star_border'} sm />{ ' ' }
    <h2 style={{ display: 'inline' }}>
      { noTitle ? '' : `#${name}` }
    </h2>
  </a>
);

export default FavoriteCategoryButton;
