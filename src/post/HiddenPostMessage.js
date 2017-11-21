import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const HiddenPostMessage = ({ onClick }) => (
  <div className="center">
    <h3>
      <FormattedMessage
        id="post_hidden_for_low_ratings"
        defaultMessage="This post is currently hidden due to the author's low reputation or low post rating."
      />
      <br />
      <a role="presentation" onClick={onClick}>
        <FormattedMessage id="display_post" defaultMessage="Display post" />
      </a>
    </h3>
  </div>
);

HiddenPostMessage.propTypes = {
  onClick: PropTypes.func,
};

HiddenPostMessage.defaultProps = {
  onClick: () => {},
};

export default HiddenPostMessage;
