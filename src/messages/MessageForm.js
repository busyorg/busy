import React, { Component, PropTypes } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import keycode from 'keycode';

import './MessageForm.scss';
import { connect } from 'react-redux';
import { sendMessage } from './messagesActions';

class MessageForm extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    username: PropTypes.string,
    channel: PropTypes.string,
    onMessageSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  handleSubmit = (e) => {
    if (e) e.preventDefault();

    const message = {
      senderUsername: this.props.username,
      channelName: this.props.channel,
      text: this.state.text,
      sentAt: new Date(),
    };

    this.props.sendMessage(message);
    this.setState({
      text: ''
    });
  };

  changeHandler = (e) => {
    this.setState({
      text: e.target.value
    });
  };

  onKeydown(e) {
    if (keycode(e) === 'enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit();
    }
  }

  render() {
    this.onKeydown = this.onKeydown.bind(this);
    return (
      <form className="MessageForm message-form" onSubmit={this.handleSubmit}>
        <div className="container">
          <TextareaAutosize
            rows={1}
            autoFocus
            className="MessageForm__input pas"
            type="text"
            name="message"
            onKeyDown={this.onKeydown}
            onChange={this.changeHandler}
            placeholder={this.props.placeholder || 'Say something!'}
            value={this.state.text}
          />
        </div>
      </form>
    );
  }
}

MessageForm = connect(() => ({}), {
  sendMessage,
})(MessageForm);

export default MessageForm;
