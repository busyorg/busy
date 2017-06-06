import React from 'react';
import Avatar from '../Avatar';
import './Notifications.less';

const Notifications = () =>
  <div className="Notifications">
    <div className="Notifications__notification Notifications__notification--unread">
      <Avatar username="guest123" size={40} />
      <div className="Notifications__notification__text">
        <div className="Notifications__notification__text__message">
          <a>guest123</a> is now following you.
        </div>
        <div className="Notifications__notification__text__date">
          2 days ago
        </div>
      </div>
    </div>
    <div className="Notifications__notification">
      <Avatar username="guest123" size={40} />
      <div className="Notifications__notification__text">
        <div className="Notifications__notification__text__message">
          <a>guest123</a> is now following you.
        </div>
        <div className="Notifications__notification__text__date">
          2 days ago
        </div>
      </div>
    </div>
    <div className="Notifications__footer">
      <a>See All</a>
    </div>
  </div>;

export default Notifications;
