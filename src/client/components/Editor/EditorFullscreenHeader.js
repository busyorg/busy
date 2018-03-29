import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Action from '../Button/Action';

const EditorFullscreenHeader = ({
  saving,
  loading,
  isUpdating,
  intl,
  handleSubmit,
  words,
  minutes,
}) => (
  <div className="EditorFullscreen__header">
    <span className="EditorFullscreen__header__info">
      <i className="iconfont icon-markdown" />
      <FormattedMessage id="markdown_supported" defaultMessage="Styling with markdown supported" />
    </span>
    <div className="EditorFullscreen__header__right">
      {saving && (
        <span className="EditorFullscreen__header__right__saving">
          <FormattedMessage id="saving" defaultMessage="Saving..." />
        </span>
      )}
      <div className="EditorFullscreen__header__word-count">
        <FormattedMessage
          id="reading_time"
          defaultMessage="{words} words / {min} min read"
          values={{ words, min: Math.ceil(minutes) }}
        />
      </div>
      {isUpdating ? (
        <Action
          primary
          loading={loading}
          disabled={loading}
          text={intl.formatMessage({
            id: loading ? 'post_send_progress' : 'post_update_send',
            defaultMessage: loading ? 'Submitting' : 'Update post',
          })}
        />
      ) : (
        <Action
          primary
          loading={loading}
          disabled={loading}
          onClick={handleSubmit}
          text={intl.formatMessage({
            id: loading ? 'post_send_progress' : 'post_send',
            defaultMessage: loading ? 'Submitting' : 'Post',
          })}
        />
      )}
    </div>
  </div>
);

EditorFullscreenHeader.propTypes = {
  saving: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  handleSubmit: PropTypes.func.isRequired,
  words: PropTypes.number,
  minutes: PropTypes.number,
};

EditorFullscreenHeader.defaultProps = {
  words: 0,
  minutes: 0,
};

export default injectIntl(EditorFullscreenHeader);
