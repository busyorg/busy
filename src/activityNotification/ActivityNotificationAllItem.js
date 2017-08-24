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
      <div className="ActivityNotifList__item">
        <Link to={`/@${notification.from_username}`}>
          <Avatar
            username={notification.from_username}
            sm
            className="ActivityNotifList__item__photo"
          />
        </Link>
        <div className="ActivityNotifList__item__desc">
          <span>
            <Link to={notification.url}>
              {makeNotificationTitle(notification, this.props.listByNotificationId)}
            </Link>
          </span>
          <p>{notification.body}</p>
          <i className="ActivityNotifList__item___date">
            <FormattedRelative value={new Date(parseInt(notification.created_at))} />
          </i>
        </div>
      </div>
    );
  }
}