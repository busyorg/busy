import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import * as notificationConstants from '../../../../common/constants/notifications';
import NotificationFollowing from './NotificationFollowing';
import NotificationReply from './NotificationReply';
import NotificationMention from './NotificationMention';
import './Notifications.less';

const Notifications = ({ onClick, onSeeAllClick, notifications }) => (
  <div className="Notifications">
    <div className="Notifications__content">
      {_.map(notifications, (notification, index) => {
        const key = `${index}${notification.timestamp}`;
        switch (notification.type) {
          case notificationConstants.REPLY:
            return <NotificationReply key={key} onClick={onClick} notification={notification} />;
          case notificationConstants.FOLLOW:
            return (
              <NotificationFollowing key={key} onClick={onClick} notification={notification} />
            );
          case notificationConstants.MENTION:
            return <NotificationMention key={key} onClick={onClick} notification={notification} />;
          default:
            return null;
        }
      })}
    </div>
    <div className="Notifications__footer">
      <a role="presentation" onClick={onSeeAllClick}>
        <FormattedMessage id="see_all" defaultMessage="See All" />
      </a>
    </div>
  </div>
);

Notifications.propTypes = {
  onClick: PropTypes.func,
  onSeeAllClick: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.shape()),
};

Notifications.defaultProps = {
  onClick: () => {},
  onSeeAllClick: () => {},
  notifications: [],
};

export default Notifications;
