import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const CommentActionMessage = ({ actionDetails, currentUsername }) => {
  const isReply = !!actionDetails.parent_author;

  const postURL = isReply
    ? `/@${actionDetails.parent_author}/${actionDetails.parent_permlink}#@${actionDetails.author}/${
        actionDetails.permlink
      }`
    : `/@${actionDetails.author}/${actionDetails.permlink}`;

  const postLink = <Link to={postURL}>{actionDetails.permlink}</Link>;

  if (!isReply) {
    return (
      <FormattedMessage
        id="authored_post"
        defaultMessage="Authored a post ({postLink})"
        values={{ postLink }}
      />
    );
  }

  const parentAuthorLink = (
    <Link to={`/@${actionDetails.parent_author}`}>
      <span className="username">{actionDetails.parent_author}</span>
    </Link>
  );

  if (currentUsername === actionDetails.author) {
    return (
      <FormattedMessage
        id="replied_to"
        defaultMessage="Replied to {author} ({postLink})"
        values={{ author: parentAuthorLink, postLink }}
      />
    );
  }

  return (
    <FormattedMessage
      id="user_replied_to"
      defaultMessage="{username} replied to {author} ({postLink})"
      values={{
        username: (
          <Link to={`/@${actionDetails.author}`}>
            <span className="username">{actionDetails.author}</span>
          </Link>
        ),
        author: parentAuthorLink,
        postLink,
      }}
    />
  );
};

CommentActionMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
};

export default CommentActionMessage;
