import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const HiddenCommentMessage = ({ onClick }) => (
  <div className="Comment__hidden__message Body">
    <FormattedMessage
      id="comment_hidden_message"
      defaultMessage="This comment is currently hidden due to the author's low reputation or low comment rating."
    />
    <br />
    <a role="presentation" onClick={onClick}>
      <FormattedMessage id="reveal_comment" defaultMessage="Reveal comment" />
    </a>
  </div>
);

HiddenCommentMessage.propTypes = {
  onClick: PropTypes.func,
};

HiddenCommentMessage.defaultProps = {
  onClick: () => {},
};

export default HiddenCommentMessage;
