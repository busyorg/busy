import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import './EditorFullScreenHeader.less';

const EditorFullScreenHeader = ({ saving }) => (
  <div className="EditorFullScreen__header">
    <span className="EditorFullScreen__header__info">
      <span className="EditorFullScreen__header__brand">
        <i className="iconfont icon-busy EditorFullScreen__header__brand__icon" />
        busy
      </span>
      <span className="EditorFullScreen__header__brand__version-beta">beta</span>
    </span>
    <div className="EditorFullScreen__header__right">
      {saving && (
        <span className="EditorFullScreen__header__right__saving">
          <FormattedMessage id="saving" defaultMessage="Saving..." />
        </span>
      )}
      <div className="EditorFullScreen__header__minimize">
        <i className="iconfont icon-narrow" />
        <FormattedMessage id="minimize" defaultMessage="Minimize" />
      </div>
    </div>
  </div>
);

EditorFullScreenHeader.propTypes = {
  saving: PropTypes.bool.isRequired,
};

export default EditorFullScreenHeader;
