import React from 'react';
import Icon from '../widgets/Icon';

const FavoriteCategoryButton = ({ name, onClick, isFavorited }) => {
  return (
    <h2 className="mt-1 mb-0 text-xs-center">
      <a onClick={onClick}>
        <Icon name={isFavorited ? 'star' : 'star_border'} sm />{ ' ' }
        #{ name }
      </a>
    </h2>
  );
};

export default FavoriteCategoryButton;
