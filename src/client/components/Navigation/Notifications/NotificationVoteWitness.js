import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../helpers/formatter';
import './Notification.less';

const NotificationVoteWitness = ({ notification, read, onClick }) => (
  <Link
    to={`/@${notification.account}`}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={notification.account} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        {notification.approve ? (
          <FormattedMessage
            id="notification_approved_witness"
            defaultMessage="{username} approved your witness"
            values={{
              username: <span className="username">{notification.account}</span>,
            }}
          />
        ) : (
          <FormattedMessage
            id="notification_unapproved_witness"
            defaultMessage="{username} unapproved your witness"
            values={{
              username: <span className="username">{notification.account}</span>,
            }}
          />
        )}
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationVoteWitness.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationVoteWitness.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationVoteWitness;
