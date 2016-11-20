import React from 'react';
import Icon from '../../widgets/Icon';

const LikeButton = ({onClick, onTextClick, active, numberOfVotes}) => {
  return (
    <div>
      <a
        onClick={onClick}
        className={active ? 'active' : ''}
      >
        <Icon name="thumb_up" small />
      </a>
      { ' ' }
      <a
        onClick={onTextClick}
        className={active ? 'active' : ''}
      >
        { numberOfVotes }
        <span className="hidden-xs"> Likes</span>
      </a>
    </div>
  );
};

export default LikeButton;
