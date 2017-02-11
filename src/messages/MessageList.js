import React, { Component, PropTypes } from 'react';
import map from 'lodash/map';
import { connect } from 'react-redux';

import './MessageList.scss';
import MessageDateGroup from './MessageDateGroup';
import { groupMessagesByDate } from './messageGroupHelpers';
import { sendReadAcknoledgement } from './messagesActions';

class MessageList extends Component {
  static propTypes = {
    messages: PropTypes.array
  };

  sendReadAcks() {
    this.props.sendReadAcknoledgement(this.props.messages);
  }

  componentDidMount() {
    this.sendReadAcks();
  }

  componentDidUpdate() {
    this.sendReadAcks();

    document.body.scrollTop = document.body.scrollHeight;
    // Firefox Compatibility while document.scrollingElement isn't available
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }

  render() {
    const { messages, username } = this.props;
    const dateGroups = groupMessagesByDate(messages);
    const messageEls = map(dateGroups, (dateGroup, i) => (
      <MessageDateGroup
        key={i}
        model={dateGroup}
      />
    ));

    return (
      <div className="MessageList messages-content media-list">
        <div className="py-4 text-center">
          {username
            ? <p className="mb-4">
              This is the beginning of your private message history with <b>@{username}</b>.
            </p>
            : <p className="mb-4">
              This is the beginning of the chat.
            </p>
          }
        </div>
        {messageEls}
      </div>
    );
  }
}

MessageList = connect(() => ({}), {
  sendReadAcknoledgement,
})(MessageList);

export default MessageList;
