import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const NSFWStoryPreviewMessage = ({ onClick }) => (
  <div className="Story__warning__message">
    <h4>
      <FormattedMessage
        id="post_preview_hidden_for_nsfw"
        defaultMessage="This post preview is currently hidden since it is tagged NSFW."
      />
      <br />
      <a role="presentation" onClick={onClick}>
        <FormattedMessage id="display_post_preview" defaultMessage="Display post preview" />
      </a>
    </h4>
  </div>
);

NSFWStoryPreviewMessage.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default NSFWStoryPreviewMessage;
