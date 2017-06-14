import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { FormattedRelative } from 'react-intl';
import { withRouter, Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import Avatar from '../widgets/Avatar';
import * as activityNotificationsActions from './activityNotificationActions';
import Loading from '../widgets/Loading'
import { makeNotificationTitle, uniqNotifications } from './activityNotificationHelpers';
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
    const { activityNotification } = this.props;

    if (!activityNotification.isFetching) {
      this.props.fetchActivityNotifications();
    }
  }

  handleClick = (e, notification) => {
    e.stopPropagation();
    this.props.router.push(notification.url);
  }

  render() {
    const { activityNotification } = this.props;
    const { list, isFetching } = activityNotification;

    const listByNotificationId = _.groupBy(list, 'notification_id');

    return (
      <div>
        {isFetching && <Loading />}
        <div className="ActivityNotifList">
          {list && uniqNotifications(list).map((notification) =>
            <div className="ActivityNotifList__item" onClick={e => { this.handleClick(e, notification) }}>
              <Avatar
                username={notification.from_username}
                sm
                className="ActivityNotifList__item__photo"
              />
              <div className="ActivityNotifList__item__desc">
                <span>{makeNotificationTitle(notification, listByNotificationId)}</span>
                <p>{notification.body}</p>
                <i className="ActivityNotifList__item___date">
                  1 minute ago
                </i>
              </div>
            </div>
          )}
        </div>
        <Link to="/notifications" >See All</Link>
      </div>
    );
  }
}