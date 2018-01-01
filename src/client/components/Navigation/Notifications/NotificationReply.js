import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationReply = ({ onClick, id, read, date, payload }) => (
  <div
    role="presentation"
    onClick={() => onClick(id)}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
  >
    <Avatar username={payload.user} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="notification_reply_username_post"
          defaultMessage="{username} replied you on your {post}."
          values={{
            username: <Link to={`/${payload.user}`}>{payload.user}</Link>,
            post: <Link to={payload.post_url}>{payload.post_title}</Link>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>
);

NotificationReply.propTypes = {
  onClick: PropTypes.func,
  id: PropTypes.number.isRequired,
  read: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  payload: PropTypes.shape().isRequired,
};

NotificationReply.defaultProps = {
  onClick: () => {},
};

export default NotificationReply;
