import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';

const LikeButton = ({ onClick, onTextClick, active, numberOfVotes, layout }) => {
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
      {(isCardLayout && parseInt(numberOfVotes) !== 0) &&
        <a
          onClick={onTextClick}
          className={active ? 'active' : ''}
        >
          {numberOfVotes}
          <span className="hidden-xs">
            {' '}<FormattedMessage id="likes" />
          </span>
        </a>
      }
      {(isCardLayout && parseInt(numberOfVotes) === 0) &&
        <span>
          {numberOfVotes}
          <span className="hidden-xs">
            {' '}<FormattedMessage id="likes" />
          </span>
        </span>
      }
      {isListLayout && <span>{numberOfVotes}</span>}
    </div>
  );
};

export default LikeButton;
