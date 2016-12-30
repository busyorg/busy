import React from 'react';
import Icon from '../../widgets/Icon';

export default function LikeButton({ onClick, onTextClick, active, numberOfVotes, layout }) {
  const isCardLayout = layout === 'card';
  const isListLayout = layout === 'list';
  return (
    <div>
      <a
        onClick={onClick}
        className={active ? 'active' : ''}
      >
        <Icon name="thumb_up" sm/>
      </a>
      { ' ' }

      { (isCardLayout && parseInt(numberOfVotes) !== 0) &&
        <a
          onClick={onTextClick}
          className={active ? 'active' : ''}
        >
          { numberOfVotes }
          <span className="hidden-xs"> Likes</span>
        </a>
      }

      { (isCardLayout && parseInt(numberOfVotes) === 0) &&
        <span>
          { numberOfVotes }
        <span className="hidden-xs"> Likes</span>
        </span>
      }

      { isListLayout &&
      <span>
          { numberOfVotes }
        </span>
      }

    </div>
  );
}
