import React, { Component, PropTypes } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import keycode from 'keycode';
import { connect } from 'react-redux';
import EmojiPicker from 'emojione-picker';
import 'emojione-picker/css/picker.css';
import { sendMessage } from './messagesActions';
import Icon from '../widgets/Icon';
import './MessageForm.less';


@connect(
  state => ({
    sidebarIsVisible: state.app.sidebarIsVisible,
  }),
  { sendMessage }
)
export default class MessageForm extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    username: PropTypes.string,
    channel: PropTypes.oneOf([
      PropTypes.string,
      PropTypes.array,
    ]),
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

    // setInterval(() => {
    //   this.props.sendMessage({
    //     senderUsername: this.props.username,
    //     channelName: this.props.channel,
    //     text: new Date().toISOString(),
    //   })
    // }, 1000);
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

  handleEmojiSelect = ({ shortname }) => {
    this.setState({
      showEmoji: false,
      text: `${this.state.text} ${shortname}`
    });
  };

  render() {
    const { sidebarIsVisible } = this.props;
    return (
      <form
        className={ sidebarIsVisible ? 'MessageForm withSidebar' : 'MessageForm'}
        onSubmit={this.handleSubmit}
      >
        <hr className="mt-0" />
        <div className="mx-4 my-3">
          { this.state.showEmoji &&
            <div className="MessageForm__emojiContainer">
              <div onClick={this.handleEmojiBoxClick}>
                <EmojiPicker onChange={data => this.handleEmojiSelect(data)} />
              </div>
            </div>
          }
          <TextareaAutosize
            rows={1}
            className="MessageForm__input"
            type="text"
            name="message"
            onKeyDown={this.submitIfEnterWithoutShift}
            onChange={this.handleChatEditorChange}
            placeholder={this.props.placeholder || 'Say something!'}
            value={this.state.text}
          />
          <a onClick={this.handleEmojiButtonClick} >
            <Icon name="mood" className="MessageForm__emojiButton p-2" />
          </a>
        </div>
      </form>
    );
  }
}
