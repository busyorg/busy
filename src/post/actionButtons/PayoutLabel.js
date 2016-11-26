import React from 'react';
import Icon from '../../widgets/Icon';

const LikeButton = ({ value }) => {
  return (
    <div>
      <span className="hidden-xs">
        <Icon name="attach_money" small />
        { ' ' }
      </span>
      { value }
    </div>
  );
};

export default LikeButton;



