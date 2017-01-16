import React from 'react';
import { injectIntl } from 'react-intl';
import Icon from '../widgets/Icon';
import './FavoriteButton.scss';
import TooltipOrigin from '../app/TooltipOrigin';

const FavoriteCategoryButton = ({ children, onClick, isFavorited, intl }) =>
  <TooltipOrigin
    content={intl.formatMessage({ id: '@tooltip_add_fav' })}
    active={!isFavorited}
  >
    <a
      className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'}
      onClick={onClick}
    >
      <Icon name={isFavorited ? 'star' : 'star_border'} sm />
      { children && ' ' }
      { children }
    </a>
  </TooltipOrigin>;

export default injectIntl(FavoriteCategoryButton);
