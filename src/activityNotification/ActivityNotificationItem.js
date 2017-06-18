import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router';
import _ from 'lodash';
import Avatar from '../widgets/Avatar';
import * as activityNotificationsActions from './activityNotificationActions';
import { makeNotificationTitle } from './activityNotificationHelpers';


export default class ActivityNotificationItem extends Component {
  componentDidMount() {
    const { markAsSeen } = this.props;
    this.props.markAsSeen(this.props.notification.notification_id);
  }

  render() {
    const { notification } = this.props;

    return (
      <div className="ActivityNotifList__item" onClick={e => { this.props.onClick(e, notification) }}>
        <Avatar
          username={notification.from_username}
          sm
          className="ActivityNotifList__item__photo"
        />
        <div className="ActivityNotifList__item__desc">
          <span>{makeNotificationTitle(notification, this.props.listByNotificationId)}</span>
          <p>{notification.body}</p>
          <i className="ActivityNotifList__item___date">
            <FormattedRelative value={new Date(parseInt(notification.created_at))} />
          </i>
        </div>
      </div>
    );
  }
}