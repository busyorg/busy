import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import { MAXIMUM_UPLOAD_SIZE } from '../../helpers/image';
import Body, { remarkable } from '../Story/Body';
import editorBase from '../Editor/EditorBase';
import './EmbeddedCommentForm.less';

@injectIntl
@editorBase
class EmbeddedCommentForm extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    parentPost: PropTypes.shape().isRequired,
    isLoading: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    imageUploading: PropTypes.bool,
    dropzoneActive: PropTypes.bool,
    onImageInvalid: PropTypes.func,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
    handlePastedImage: PropTypes.func,
    handleImageChange: PropTypes.func,
    handleDrop: PropTypes.func,
    updateIsDisabledSubmit: PropTypes.func,
    handleDragLeave: PropTypes.func,
    handleDragEnter: PropTypes.func,
  };

  static defaultProps = {
    isLoading: false,
    inputValue: '',
    imageUploading: false,
    dropzoneActive: false,
    onImageInvalid: () => {},
    onSubmit: () => {},
    onClose: () => {},
    handlePastedImage: () => {},
    handleImageChange: () => {},
    handleDrop: () => {},
    updateIsDisabledSubmit: () => {},
    handleDragLeave: () => {},
    handleDragEnter: () => {},
  };

  state = {
    inputValue: this.props.inputValue,
  };

  componentDidMount() {
    if (this.input) {
      this.input.addEventListener('paste', e => this.props.handlePastedImage(this.disableAndInsertImage, e));

      if (this.props.parentPost.depth !== 0) {
        this.input.focus();
      }
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

  setInputCursorPosition = (pos) => {
    if (this.input && this.input.setSelectionRange) {
      this.input.setSelectionRange(pos, pos);
    }
  }

  insertImage = (image, imageName = 'image') => {
    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    const imageText = `![${imageName}](${image})\n`;
    const newValue = `${this.input.value.substring(
      0,
      startPos,
    )}${imageText}${this.input.value.substring(endPos, this.input.value.length)}`;
    this.setState({ inputValue: newValue });
    this.setInputCursorPosition(startPos + imageText.length);
  };

  handleCommentTextChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSubmit = (e) => {
    e.stopPropagation();
    this.props.updateIsDisabledSubmit(true);
    if (this.state.inputValue) {
      this.props.onSubmit(this.props.parentPost, this.state.inputValue);
    }
  };

  render() {
    const { intl, isLoading } = this.props;
    const buttonClass = isLoading
      ? 'EmbeddedCommentForm__button_disabled'
      : 'EmbeddedCommentForm__button_primary';

    return (
      <div className="EmbeddedCommentForm">
        <div className="EmbeddedCommentForm__dropzone-base">
          <Dropzone
            disableClick
            style={{}}
            accept="image/*"
            maxSize={MAXIMUM_UPLOAD_SIZE}
            onDropRejected={this.props.onImageInvalid}
            onDrop={files => this.props.handleDrop(this.insertImage, files)}
            onDragEnter={this.props.handleDragEnter}
            onDragLeave={this.props.handleDragLeave}
          >
            {this.props.dropzoneActive && (
              <div className="EmbeddedCommentForm__dropzone">
                <div>
                  <i className="iconfont icon-picture" />
                  <FormattedMessage id="drop_image" defaultMessage="Drop your images here" />
                </div>
              </div>
            )}
            <Input
              id="commentFormInput"
              ref={ref => this.setInput(ref)}
              value={this.state.inputValue}
              autosize={{ minRows: 2, maxRows: 6 }}
              onChange={this.handleCommentTextChange}
              placeholder={intl.formatMessage({
                id: 'comment_placeholder',
                defaultMessage: 'Write a comment',
              })}
              type="textarea"
              disabled={isLoading}
            />
          </Dropzone>
        </div>
        <p className="EmbeddedCommentForm__imagebox">
          <input
            type="file"
            accept="image/*"
            id={`inputfile-edit${this.props.parentPost.id}`}
            onChange={e => this.props.handleImageChange(this.insertImage, e)}
          />
          <label htmlFor={`inputfile-edit${this.props.parentPost.id}`}>
            {this.props.imageUploading ? (
              <Icon type="loading" />
            ) : (
              <i className="iconfont icon-picture" />
            )}
            {this.props.imageUploading ? (
              <FormattedMessage id="image_uploading" defaultMessage="Uploading your image..." />
            ) : (
              <FormattedMessage
                id="select_or_past_image"
                defaultMessage="Select image or paste it from the clipboard."
              />
            )}
          </label>
        </p>
        <button
          onClick={this.handleSubmit}
          disabled={isLoading}
          className={`EmbeddedCommentForm__button ${buttonClass}`}
        >
          {isLoading && <Icon type="loading" />}
          {isLoading ? (
            <FormattedMessage id="comment_update_progress" defaultMessage="Updating" />
          ) : (
            <FormattedMessage id="comment_update_send" defaultMessage="Update comment" />
          )}
        </button>
        <a role="presentation" className="EmbeddedCommentForm__close" onClick={this.props.onClose}>
          <FormattedMessage id="close" defaultMessage="Close" />
        </a>
        {this.state.inputValue && (
          <div className="EmbeddedCommentForm__preview">
            <span className="Editor__label">
              <FormattedMessage id="preview" defaultMessage="Preview" />
            </span>
            <Body body={remarkable.render(this.state.inputValue)} />
          </div>
        )}
      </div>
    );
  }
}

export default EmbeddedCommentForm;
