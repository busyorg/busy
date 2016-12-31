import React from 'react';
import Icon from '../widgets/Icon';

const FavoriteCategoryButton = ({ name, onClick, isFavorited, noTitle }) => {
  return (
    <h2
      className="mt-1 mb-0 text-xs-center"
      style={noTitle ? { display: 'inline-block' } : {}}
    >
      <a onClick={onClick}>
        <Icon name={isFavorited ? 'star' : 'star_border'} sm />{ ' ' }
        { noTitle ? '' : `#${name}` }
      </a>
    </h2>
  );
};

export default FavoriteCategoryButton;
