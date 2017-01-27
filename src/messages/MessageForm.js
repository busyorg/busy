import React, { Component, PropTypes } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import keycode from 'keycode';
import { connect } from 'react-redux';
import EmojiPicker from 'emojione-picker';
import 'emojione-picker/css/picker.css';
import { sendMessage } from './messagesActions';
import Icon from '../widgets/Icon';
import './MessageForm.scss';


@connect(
  () => ({}),
  { sendMessage }
)
export default class MessageForm extends Component {
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

  handleEmojiButtonClick = (e) => {
    e.stopPropagation();
    this.setState({ showEmoji: !this.state.showEmoji });
  };

  handleChatEditorChange = (e) => {
    this.setState({
      text: e.target.value
    });
  };

  submitIfEnterWithoutShift = (e) => {
    if (keycode(e) === 'enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  handlePageClick = (e) => {
    e.preventDefault();
    this.setState({ showEmoji: false });
  };

  handleEmojiBoxClick = (e) => {
    e.stopPropagation();
  };

  render() {
    return (
      <form className="MessageForm message-form" onSubmit={this.handleSubmit}>
        <div className="container" >

          { this.state.showEmoji &&
            <div className="MessageForm__emojiContainer">
              <div onClick={this.handleEmojiBoxClick}>
                <EmojiPicker onChange={function(data){
                  console.log("Emoji chosen", data);
                }} />
              </div>
            </div>
          }

          <TextareaAutosize
            rows={1}
            autoFocus
            className="MessageForm__input pas"
            type="text"
            name="message"
            onKeyDown={this.submitIfEnterWithoutShift}
            onChange={this.handleChatEditorChange}
            placeholder={this.props.placeholder || 'Say something!'}
            value={this.state.text}
          />

          <a onClick={this.handleEmojiButtonClick} >
            <Icon name="mood" className="MessageForm__emojiButton" />
          </a>

        </div>
      </form>
    );
  }
}
