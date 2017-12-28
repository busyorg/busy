import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import './FavoriteButton.less';

const FavoriteButton = ({ intl, isFavorited, onClick }) => (
  <Tooltip
    title={intl.formatMessage({
      id: isFavorited ? 'remove_from_favorites' : 'add_to_favorites',
      defaultMessage: isFavorited ? 'Remove from favorites' : 'Add to favorites',
    })}
  >
    <a
      role="presentation"
      className={isFavorited ? 'FavoriteButton FavoriteButton--active' : 'FavoriteButton'}
      onClick={onClick}
    >
      <i
        className={classNames('iconfont', {
          'icon-collection': !isFavorited,
          'icon-collection_fill': isFavorited,
        })}
      />
    </a>
  </Tooltip>
);

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
