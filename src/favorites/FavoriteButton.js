import React from 'react';
import { SimpleTooltipOrigin } from '../widgets/tooltip/SimpleTooltip';
import { injectIntl } from 'react-intl';
import Icon from '../widgets/Icon';
import './FavoriteButton.less';

const FavoriteUserButton = ({ onClick, isFavorited, intl }) =>
  <SimpleTooltipOrigin
    message={intl.formatMessage({
      id: isFavorited
        ? '@tooltip_remove_fav'
        : '@tooltip_add_fav',
      defaultMessage: isFavorited ?
        'Remove from favorites' :
        'Add in favorites',
    })}
  >
    <a
      className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'}
      onClick={onClick}
    >
      <Icon name={isFavorited ? 'star' : 'star_border'} sm />
    </a>
  </SimpleTooltipOrigin>;

export default injectIntl(FavoriteUserButton);
