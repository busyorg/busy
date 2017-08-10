import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Input, Icon } from 'antd';
import Avatar from '../Avatar';
import './CommentForm.less';

class CommentForm extends React.Component {
  static propTypes = {
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
    const { username, isSmall, isLoading } = this.props;
    const buttonClass = isLoading ? 'CommentForm__button_disabled' : 'CommentForm__button_primary';

    return (
      <div className="CommentForm">
        <Avatar username={username} size={!isSmall ? 40 : 32} />
        <div className="CommentForm__text">
          <Input
            type="textarea"
            ref={ref => this.setInput(ref)}
            value={this.state.inputValue}
            onChange={this.handleCommentTextChange}
            placeholder="Write a comment"
            disabled={isLoading}
          />
          <p className="CommentForm__imagebox">
            <input type="file" id={`inputfile${this.props.parentPost.id}`} onChange={this.handleImageChange} />
            <label htmlFor={`inputfile${this.props.parentPost.id}`}>
              {(this.state.imageUploading) ? <Icon type="loading" /> : <i className="iconfont icon-picture" />}
              {(this.state.imageUploading) ? 'Uploading your image' : 'Select image or paste it from the clipboard.'}
            </label>
          </p>
          <button
            onClick={this.handleSubmit}
            disabled={isLoading}
            className={`CommentForm__button ${buttonClass}`}
          >
            {isLoading && <Icon type="loading" />}
            {isLoading ? 'Commenting' : 'Comment'}
          </button>
        </div>
      </div>
    );
  }
}

export default CommentForm;
