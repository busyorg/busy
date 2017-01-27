import React from 'react';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';
import { injectIntl } from 'react-intl';
import Icon from '../widgets/Icon';
import './FavoriteButton.scss';

const FavoriteUserButton = ({ onClick, isFavorited, intl }) =>
  <OverlayTrigger
    overlay={
      <Tooltip>
        {intl.formatMessage({ id: isFavorited ? '@tooltip_remove_fav' : '@tooltip_add_fav' })}
      </Tooltip>}
  >
    <a
      className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'}
      onClick={onClick}
    >
      <Icon name={isFavorited ? 'star' : 'star_border'} sm />
    </a>
  </OverlayTrigger>;

export default injectIntl(FavoriteUserButton);
