import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const EditorFullScreenHeader = ({ saving, words, minutes }) => (
  <div className="EditorFullScreen__header">
    <span className="EditorFullScreen__header__info">
      <span className="EditorFullScreen__brand">
        <i className="iconfont icon-busy EditorFullScreen__brand-icon" />
        BUSY
      </span>
    </span>
    <div className="EditorFullScreen__header__right">
      {saving && (
        <span className="EditorFullScreen__header__right__saving">
          <FormattedMessage id="saving" defaultMessage="Saving..." />
        </span>
      )}
      <div className="EditorFullScreen__header__word-count">
        <FormattedMessage
          id="reading_time"
          defaultMessage="{words} words / {min} min read"
          values={{ words, min: Math.ceil(minutes) }}
        />
      </div>
    </div>
  </div>
);

EditorFullScreenHeader.propTypes = {
  saving: PropTypes.bool.isRequired,
  words: PropTypes.number,
  minutes: PropTypes.number,
};

EditorFullScreenHeader.defaultProps = {
  words: 0,
  minutes: 0,
};

export default EditorFullScreenHeader;
