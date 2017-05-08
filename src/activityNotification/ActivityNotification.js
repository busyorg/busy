import React, { Component } from 'react';
import Avatar from '../widgets/Avatar';
import './ActivityNotification.scss';

export default class ActivityNotification extends Component {
  render() {
    return (
      <div className="ActivityNotifList">
        <div className="ActivityNotifList__item">
          <Avatar
            username="p0o"
            sm
            className="ActivityNotifList__item__photo"
          />
          <div className="ActivityNotifList__item__desc">
            <p>p0o sent a new comment to you</p>
            <i className="ActivityNotifList__item___date">10 minutes ago</i>
          </div>
        </div>
      </div>
    );
  }
}