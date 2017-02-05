import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';

const LikeButton = ({ onClick, active, numberOfVotes, layout }) => {
  const isCardLayout = layout === 'card';
  const isListLayout = layout === 'list';
  return (
    <div>
      <a
        onClick={onClick}
        className={active ? 'active' : ''}
      >
        <Icon name="thumb_up" sm />
      </a>
      {' '}
      {isCardLayout &&
        <span>
          <span className="hidden-xs">
            {' '}<FormattedMessage id="like" />
          </span>
        </span>
      }
      {isListLayout && <span>{numberOfVotes}</span>}
    </div>
  );
};

export default LikeButton;
