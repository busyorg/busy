import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const HiddenStoryPreviewMessage = ({ onClick }) => (
  <div className="Story__warning__message">
    <h4>
      <FormattedMessage
        id="post_preview_hidden_for_low_ratings"
        defaultMessage="This post preview is currently hidden due to the author's low reputation or low post rating."
      />{' '}
      <a role="presentation" onClick={onClick}>
        <FormattedMessage id="display_post_preview" defaultMessage="Display post preview" />
      </a>
    </h4>
  </div>
);

HiddenStoryPreviewMessage.propTypes = {
  onClick: PropTypes.func,
};

HiddenStoryPreviewMessage.defaultProps = {
  onClick: () => {},
};

export default HiddenStoryPreviewMessage;
