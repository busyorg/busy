import React from 'react';
import Icon from '../../widgets/Icon';

const LikeButton = ({onClick, active, numberOfVotes}) => {
  return (
    <div>
      <a
        onClick={onClick}
        className={active ? 'active' : ''}
      >
        <Icon name="thumb_up" small />
      </a>
      { ' ' }
      { numberOfVotes }
      <span className="hidden-xs"> Likes</span>
    </div>
  );
};

export default LikeButton;
