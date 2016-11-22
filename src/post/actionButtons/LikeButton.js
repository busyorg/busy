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

      {
        parseInt(numberOfVotes) > 0 ?
          <a
            onClick={onTextClick}
            className={active ? 'active' : ''}
          >
            { numberOfVotes }
            <span className="hidden-xs"> Likes</span>
          </a>
        :
          <span>
            { numberOfVotes }
            <span className="hidden-xs"> Likes</span>
          </span>
      }

    </div>
  );
};

export default LikeButton;
