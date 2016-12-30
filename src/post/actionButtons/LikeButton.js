import React from 'react';
import Icon from '../../widgets/Icon';

const LikeButton = ({
  onClick,
  active,
  numberOfVotes,
}) =>
  <span>
    <a
      onClick={onClick}
      className={active ? 'active' : ''}
    >
      <Icon name="thumb_up" sm />
    </a>
    { ' ' }
    { numberOfVotes }
  </span>;

export default LikeButton;
