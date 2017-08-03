import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationReply = ({ onClick, id, read, date, payload }) =>
  (<div
    role="presentation"
    onClick={() => onClick(id)}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
  >
    <Avatar username={payload.user} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <Link to={`/${payload.user}`}>{payload.user}</Link> replied on your{' '}
        <Link to={payload.post_url}>post</Link>.
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>);

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
