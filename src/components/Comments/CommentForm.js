import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input, Icon } from 'antd';
import Body, { remarkable } from '../Story/Body';
import Avatar from '../Avatar';
import './CommentForm.less';

@injectIntl
class CommentForm extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    parentPost: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    isSmall: PropTypes.bool,
    isLoading: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    onImageInserted: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    username: undefined,
    isSmall: false,
    isLoading: false,
    inputValue: '',
    onImageInserted: () => {},
    onSubmit: () => {},
  };

  state = {
    inputValue: this.props.inputValue,
    isDisabledSubmit: false,
    imageUploading: false,
  };

  componentDidMount() {
    if (this.input) {
      this.input.addEventListener('paste', this.handlePastedImage);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoading) {
      this.setState({ inputValue: nextProps.inputValue || '' });
    }
  }

  setInput = (input) => {
    if (input && input.refs && input.refs.input) {
      // eslint-disable-next-line react/no-find-dom-node
      this.input = ReactDOM.findDOMNode(input.refs.input);
    }
  };

  insertImage = (image, imageName = 'image') => {
    this.setState({
      imageUploading: false,
    });

    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    this.input.value = `${this.input.value.substring(
      0,
      startPos,
    )}![${imageName}](${image})${this.input.value.substring(endPos, this.input.value.length)}`;
  };

  handleCommentTextChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handlePastedImage = (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      Array.from(items).forEach((item) => {
        if (item.kind === 'file') {
          e.preventDefault();

          this.setState({
            imageUploading: true,
          });

          const blob = item.getAsFile();
          this.props.onImageInserted(blob, this.insertImage, () => this.setState({
            imageUploading: false,
          }));
        }
      });
    }
  };

  handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      this.setState({
        imageUploading: true,
      });
      this.props.onImageInserted(e.target.files[0], this.insertImage, () => this.setState({
        imageUploading: false,
      }));
    }
  };

  handleSubmit = (e) => {
    e.stopPropagation();
    this.setState({ isDisabledSubmit: true });
    if (this.state.inputValue) {
      this.props.onSubmit(this.props.parentPost, this.state.inputValue);
    }
  };

  render() {
    const { intl, username, isSmall, isLoading } = this.props;
    const buttonClass = isLoading ? 'CommentForm__button_disabled' : 'CommentForm__button_primary';

    return (
      <div className="CommentForm">
        <Avatar username={username} size={!isSmall ? 40 : 32} />
        <div className="CommentForm__text">
          <Input
            ref={ref => this.setInput(ref)}
            value={this.state.inputValue}
            autosize={{ minRows: 2, maxRows: 6 }}
            onChange={this.handleCommentTextChange}
            placeholder={intl.formatMessage({ id: 'comment_placeholder', defaultMessage: 'Write a comment' })}
            type="textarea"
            disabled={isLoading}
          />
          <p className="CommentForm__imagebox">
            <input type="file" id={`inputfile${this.props.parentPost.id}`} onChange={this.handleImageChange} />
            <label htmlFor={`inputfile${this.props.parentPost.id}`}>
              {(this.state.imageUploading) ? <Icon type="loading" /> : <i className="iconfont icon-picture" />}
              {(this.state.imageUploading) ? <FormattedMessage id="image_uploading" defaultMessage="Uploading your image..." /> : <FormattedMessage id="select_or_past_image" defaultMessage="Select image or paste it from the clipboard." />}
            </label>
          </p>
          <button
            onClick={this.handleSubmit}
            disabled={isLoading}
            className={`CommentForm__button ${buttonClass}`}
          >
            {isLoading && <Icon type="loading" />}
            {isLoading ? <FormattedMessage id="comment_send_progress" defaultMessage="Commenting" /> : <FormattedMessage id="comment_send" defaultMessage="Comment" />}
          </button>
          {this.state.inputValue &&
            <div className="CommentForm__preview">
              <span className="Editor__label"><FormattedMessage id="preview" defaultMessage="Preview" /></span>
              <Body body={remarkable.render(this.state.inputValue)} />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default CommentForm;
