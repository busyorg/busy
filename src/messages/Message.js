import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

class Message extends Component {
  render() {
    const { model } = this.props;
    const sentAt = model[0].sentAt;
    const senderUsername = model[0].senderUsername;
    const humanSentAt = moment(sentAt).format('hh:mm');

    return (
      <li
        className="Message message"
      >
        <div className="media">
          <div className="container">
            <div className="media-left">
              <img
                className="media-object"
                alt=""
                style={{ maxWidth: 'none', width: '50px' }}
                src={`https://img.busy6.com/@${model[0].senderUsername}`}
              />
            </div>

            <div className="media-body">

              <div className="media-heading">
                <b>@{senderUsername}</b>
                <span
                  style={{
                    textTransform: 'uppercase',
                    paddingLeft: '10px',
                    color: '#ccc',
                    backgroundColor: 'transparent'
                  }}
                >
                  {humanSentAt}
                </span>
              </div>

              <p>
                {model[0].text}
              </p>

            </div>
          </div>
        </div>

        {
          model.slice(1).map(({ text }, i) => (
            <div className="media" key={i}>
              <div className="container">
                <div
                  className="media-left"
                >
                  <div
                    className="Message__timestamp"
                    style={{
                      width: '50px',
                      textTransform: 'uppercase',
                      color: '#ccc'
                    }}
                  >
                    {moment(sentAt).format('hh:mm')}
                  </div>
                </div>

                <div className="media-body">
                  <p>
                    {text}
                  </p>
                </div>
              </div>
            </div>
          ))
        }
      </li>
    );
  }
}

export default Message;
