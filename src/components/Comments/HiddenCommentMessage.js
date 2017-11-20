import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const HiddenCommentMessage = ({ onClick }) => (
  <div className="Comment__hidden__message">
    <FormattedMessage
      id="comment_hidden_message"
      defaultMessage="This comment is hidden because the author has a low reputation score"
    />
    <a role="presentation" onClick={onClick}>
      <FormattedMessage id="reveal_comment" defaultMessage="reveal comment" />
    </a>
  </div>
);

HiddenCommentMessage.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default HiddenCommentMessage;
