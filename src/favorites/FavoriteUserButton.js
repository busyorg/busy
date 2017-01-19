import React from 'react';
import { injectIntl } from 'react-intl';
import Icon from '../widgets/Icon';
import TooltipOrigin from '../app/TooltipOrigin';
import './FavoriteButton.scss';

const FavoriteUserButton = ({ onClick, isFavorited, intl }) =>
  <TooltipOrigin
    content={intl.formatMessage({ id: '@tooltip_add_fav' })}
    active={!isFavorited}
  >
    <a
      className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'}
      onClick={onClick}
    >
      <Icon name={isFavorited ? 'star' : 'star_border'} sm />
      { ' ' }
    </a>
  </TooltipOrigin>;

export default injectIntl(FavoriteUserButton);
