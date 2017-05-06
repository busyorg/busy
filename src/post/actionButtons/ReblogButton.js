import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';

const ReblogButton = ({
  onClick,
  active,
  layout,
}) =>
  <a
    onClick={onClick}
    className={active ? 'active' : ''}
  >
    <Icon name="repeat" sm />
    {layout === 'card' &&
      <span className="hidden-xs">
        {' '}<FormattedMessage id="reblog" defaultMessage="Reblog" />
      </span>
    }
  </a>;

export default ReblogButton;
