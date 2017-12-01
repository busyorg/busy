import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

const QuickPostEditorHeader = ({
  selectedPreview,
  toggleSelectedPreview,
  displayPreviewOption,
}) => (
  <div className="QuickPostEditor__header">
    <span
      className={classNames('QuickPostEditor__header__item', {
        QuickPostEditor__header__item__selected: !selectedPreview,
      })}
    >
      <a onClick={() => toggleSelectedPreview(false)} role="presentation">
        <i className="iconfont icon-write QuickPostEditor__header__icon" />
        <FormattedMessage id="create_post" defaultMessage="Create post" />
      </a>
    </span>
    {displayPreviewOption &&
      <span
        className={classNames('QuickPostEditor__header__item', {
          QuickPostEditor__header__item__selected: selectedPreview,
        })}
      >
        <a onClick={() => toggleSelectedPreview(true)} role="presentation">
          <i className="iconfont icon-document QuickPostEditor__header__icon" />
          <FormattedMessage id="preview" defaultMessage="Preview" />
        </a>
      </span>}
  </div>
);

QuickPostEditorHeader.propTypes = {
  displayPreviewOption: PropTypes.bool,
  selectedPreview: PropTypes.bool,
  toggleSelectedPreview: PropTypes.func,
};

QuickPostEditorHeader.defaultProps = {
  selectedPreview: false,
  displayPreviewOption: false,
  toggleSelectedPreview: () => {},
};

export default QuickPostEditorHeader;
