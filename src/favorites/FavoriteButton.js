import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { SimpleTooltipOrigin } from '../widgets/tooltip/SimpleTooltip';
import Icon from '../widgets/Icon';
import './FavoriteButton.less';

const FavoriteButton = ({ intl, isFavorited, onClick }) =>
  (<SimpleTooltipOrigin
    message={intl.formatMessage({
      id: isFavorited ? '@tooltip_remove_fav' : '@tooltip_add_fav',
      defaultMessage: isFavorited ? 'Remove from favorites' : 'Add in favorites',
    })}
  >
    <a
      role="presentation"
      className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'}
      onClick={onClick}
    >
      <Icon name={isFavorited ? 'star' : 'star_border'} sm />
    </a>
  </SimpleTooltipOrigin>);

FavoriteButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  isFavorited: PropTypes.bool,
  onClick: PropTypes.func,
};

FavoriteButton.defaultProps = {
  isFavorited: false,
  onClick: () => {},
};

export default injectIntl(FavoriteButton);
