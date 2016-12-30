import React from 'react';
import Icon from '../../widgets/Icon';

export default function LikeButton({ onClick, onTextClick, active, numberOfVotes, layout }) {
  return (
    <div>
      <a
        onClick={onClick}
        className={active ? 'active' : ''}
      >
        <Icon name="thumb_up" sm/>
      </a>
      { ' ' }

      { layout === 'card' &&
      parseInt(numberOfVotes) !== 0 ?
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

      { layout === 'card' &&
      <span>
          { numberOfVotes }
        </span>
      }

    </div>
  );
}
