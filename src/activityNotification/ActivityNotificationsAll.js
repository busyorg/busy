import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { FormattedRelative } from 'react-intl';
import { withRouter, Link } from 'react-router';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import Avatar from '../widgets/Avatar';
import * as activityNotificationsActions from './activityNotificationActions';
import Loading from '../widgets/Loading'
import './ActivityNotification.scss';

@connect(
  ({ activityNotification }) => ({
    activityNotification,
  }),
  (dispatch) => bindActionCreators({
    fetchActivityNotifications: activityNotificationsActions.fetchActivityNotifications,
  }, dispatch)
)
@withRouter
export default class ActivityNotification extends Component {
  componentDidMount() {
    this.props.fetchActivityNotifications(50);
  }

  handleClick = (e, notification) => {
    e.stopPropagation();
    this.props.router.push(notification.url);
  }

  render() {
    const { activityNotification } = this.props;

    return (
      <div className="main-panel">
        <div className="ActivityNotifList ActivityNotifList--all">
          {activityNotification.list && activityNotification.list.map((notification) =>
            <div className="ActivityNotifList__item" >
              <Link to={`/@${notification.from_username}`}>
                <Avatar
                  username={notification.from_username}
                  sm
                  className="ActivityNotifList__item__photo"
                />
              </Link>
              <div className="ActivityNotifList__item__desc">
                <span>
                  <Link to={notification.url}>{notification.title}</Link>
                </span>
                <p>{notification.body}</p>
                <i className="ActivityNotifList__item___date">
                  1 minute ago
                </i>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}