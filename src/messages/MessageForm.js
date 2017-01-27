import React, { Component, PropTypes } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import keycode from 'keycode';
import { connect } from 'react-redux';
import EmojiPalette, { MODES } from 'react-emoji-palette';
import { sendMessage } from './messagesActions';
import Icon from '../widgets/Icon';
import './MessageForm.scss';

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
      text: '',
      showEmoji: false,
    };
  }

  componentDidMount() {
    if (window) {
      window.addEventListener('click', this.handlePageClick);
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('click', this.handlePageClick);
    }
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

  handleEmojiButton = (e) => {
    e.stopPropagation();

    this.setState({ showEmoji: !this.state.showEmoji });
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

  handlePageClick = (e) => {
    e.preventDefault();
    this.setState({ showEmoji: false });
  };

  handleEmojiBoxClick = (e) => {
    e.stopPropagation();
  };

  render() {
    this.onKeydown = this.onKeydown.bind(this);
    return (
      <form className="MessageForm message-form" onSubmit={this.handleSubmit}>
        <div className="container" >

          { this.state.showEmoji &&
            <div className="MessageForm__emojiContainer">
              <div onClick={this.handleEmojiBoxClick}>
                <EmojiPalette
                  onEmojiSelect={ (emoji) => console.log(emoji) } // required
                  mode={MODES.TWEMOJI} // optional, default is NATIVE
                  maxUnicodeVersion={9} // optional, default is 8
                  displayZeroWidthJoins={true} // optional, default is false
                />
              </div>
            </div>
          }

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

          <a onClick={this.handleEmojiButton} >
            <Icon name="mood" className="MessageForm__emojiButton" />
          </a>


        </div>
      </form>
    );
  }
}

MessageForm = connect(() => ({}), {
  sendMessage,
})(MessageForm);

export default MessageForm;
