import React from 'react';
import Icon from '../widgets/Icon';

const FavoriteUserButton = ({ onClick, isFavorited }) => {
  return (
    <a onClick={onClick}>
      <Icon name={isFavorited ? 'star' : 'star_border'} md />
      { ' ' }
    </a>
  );
};

export default FavoriteUserButton;
