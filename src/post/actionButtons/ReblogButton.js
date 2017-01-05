import React from 'react';
import Icon from '../../widgets/Icon';

const ReblogButton = ({
  onClick,
  active,
  layout
}) =>
  <a
    onClick={onClick}
    className={active ? 'active' : ''}
  >
    <Icon name="repeat" sm />

    { layout === 'card' &&
    <span className="hidden-xs">
      { ' ' }
      Reblog
    </span>
    }

  </a>

export default ReblogButton;
