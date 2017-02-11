import React, { Component } from 'react';
import { FormattedDate, FormattedRelative } from 'react-intl';

import './MessageList.scss';
import MessageGroup from './MessageGroup';
import { diffDays } from '../helpers/dateHelpers';
import { propMessageDateGroup } from './messageGroupHelpers';

export default class MessageDateGroup extends Component {
  static propTypes = {
    model: propMessageDateGroup.isRequired,
  };

  renderDay() {
    if (diffDays(new Date(), this.props.model.day) < 2) {
      return (
        <FormattedRelative
          value={this.props.model.day}
          units="day"
        />
      );
    }

    return (
      <FormattedDate
        value={this.props.model.day}
        year="numeric"
        month="long"
        day="numeric"
      />
    );
  }

  render() {
    const day = this.renderDay();
    return (
      <div>
        <div
          style={{
            position: 'relative',
          }}
        >
          <p className="text-center">
            <b
              style={{
                background: 'white',
                borderRadius: 10,
                padding: 10,
                position: 'relative',
                zIndex: 1,
                textTransform: 'capitalize'
              }}
            >
              {day}
            </b>
          </p>

          <hr
            style={{
              position: 'absolute',
              top: '50%',
              width: '100%',
              margin: 0,
              zIndex: 0,
            }}
          />
        </div>

        {this.props.model.messages.map((userGroup, i) => (
          <MessageGroup
            key={[userGroup.key, i]}
            model={userGroup.messages}
          />
        ))}
      </div>
    );
  }
}
