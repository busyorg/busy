import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';

const StoryPreviewHiddenMessage = ({ onClick }) => (
  <div className="Story__warning__message">
    <h4>
      <FormattedMessage
        id="post_preview_hidden_for_low_ratings"
        defaultMessage="This post preview is hidden for low ratings"
      />
      <Button type="danger" onClick={onClick} className="float-right">
        <FormattedMessage id="display_post_preview" defaultMessage="Display post preview" />
      </Button>
    </h4>
  </div>
);

StoryPreviewHiddenMessage.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default StoryPreviewHiddenMessage;
