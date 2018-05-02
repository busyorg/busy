import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { Icon, Input } from 'antd';
import Dropzone from 'react-dropzone';
import { HotKeys } from 'react-hotkeys';
import { MAXIMUM_UPLOAD_SIZE, isValidImage } from '../../helpers/image';
import EditorToolbar from './EditorToolbar';
import './EditorInput.less';

class EditorInput extends React.Component {
  static propTypes = {
    value: PropTypes.string, // eslint-disable-line react/require-default-props
    inputId: PropTypes.string,
    addon: PropTypes.node,
    inputRef: PropTypes.func,
    onChange: PropTypes.func,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
  };

  static defaultProps = {
    addon: null,
    inputId: '',
    inputRef: () => {},
    onChange: () => {},
    onImageUpload: () => {},
    onImageInvalid: () => {},
  };

  static hotkeys = {
    h1: 'ctrl+shift+1',
    h2: 'ctrl+shift+2',
    h3: 'ctrl+shift+3',
    h4: 'ctrl+shift+4',
    h5: 'ctrl+shift+5',
    h6: 'ctrl+shift+6',
    bold: 'ctrl+b',
    italic: 'ctrl+i',
    quote: 'ctrl+q',
    link: 'ctrl+k',
    image: 'ctrl+m',
  };

  constructor(props) {
    super(props);

    this.state = {
      imageUploading: false,
      dropzoneActive: false,
    };

    this.setInput = this.setInput.bind(this);
    this.disableAndInsertImage = this.disableAndInsertImage.bind(this);
    this.insertCode = this.insertCode.bind(this);
    this.handlePastedImage = this.handlePastedImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.input) {
      this.input.addEventListener('paste', this.handlePastedImage);
    }
  }

  setInput(input) {
    if (input) {
      this.originalInput = input;
      // eslint-disable-next-line react/no-find-dom-node
      this.input = ReactDOM.findDOMNode(input);
      this.props.inputRef(this.input);
    }
  }

  setValue(value, start, end) {
    this.props.onChange(value);
    if (start && end) {
      setTimeout(() => {
        this.input.setSelectionRange(start, end);
      }, 0);
    }
  }

  insertAtCursor(before, after, deltaStart = 0, deltaEnd = 0) {
    if (!this.input) return;

    const { value } = this.props;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    const newValue =
      value.substring(0, startPos) +
      before +
      value.substring(startPos, endPos) +
      after +
      value.substring(endPos, value.length);

    this.setValue(newValue, startPos + deltaStart, endPos + deltaEnd);
  }

  disableAndInsertImage(image, imageName = 'image') {
    this.setState({
      imageUploading: false,
    });
    this.insertImage(image, imageName);
  }

  insertImage(image, imageName = 'image') {
    if (!this.input) return;

    const { value } = this.props;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    const imageText = `![${imageName}](${image})\n`;
    const newValue = `${value.substring(0, startPos)}${imageText}${value.substring(
      endPos,
      value.length,
    )}`;
    this.resizeTextarea();
    this.setValue(newValue, startPos + imageText.length, startPos + imageText.length);
  }

  insertCode(type) {
    if (!this.input) return;
    this.input.focus();

    switch (type) {
      case 'h1':
        this.insertAtCursor('# ', '', 2, 2);
        break;
      case 'h2':
        this.insertAtCursor('## ', '', 3, 3);
        break;
      case 'h3':
        this.insertAtCursor('### ', '', 4, 4);
        break;
      case 'h4':
        this.insertAtCursor('#### ', '', 5, 5);
        break;
      case 'h5':
        this.insertAtCursor('##### ', '', 6, 6);
        break;
      case 'h6':
        this.insertAtCursor('###### ', '', 7, 7);
        break;
      case 'b':
        this.insertAtCursor('**', '**', 2, 2);
        break;
      case 'i':
        this.insertAtCursor('*', '*', 1, 1);
        break;
      case 'q':
        this.insertAtCursor('> ', '', 2, 2);
        break;
      case 'link':
        this.insertAtCursor('[', '](url)', 1, 1);
        break;
      case 'image':
        this.insertAtCursor('![', '](url)', 2, 2);
        break;
      default:
        break;
    }

    this.resizeTextarea();
  }

  resizeTextarea() {
    if (this.originalInput) this.originalInput.resizeTextarea();
  }

  handlers = {
    h1: () => this.insertCode('h1'),
    h2: () => this.insertCode('h2'),
    h3: () => this.insertCode('h3'),
    h4: () => this.insertCode('h4'),
    h5: () => this.insertCode('h5'),
    h6: () => this.insertCode('h6'),
    bold: () => this.insertCode('b'),
    italic: () => this.insertCode('i'),
    quote: () => this.insertCode('q'),
    link: e => {
      e.preventDefault();
      this.insertCode('link');
    },
    image: () => this.insertCode('image'),
  };

  handlePastedImage(e) {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      Array.from(items).forEach(item => {
        if (item.kind === 'file') {
          e.preventDefault();

          const blob = item.getAsFile();

          if (!isValidImage(blob)) {
            this.props.onImageInvalid();
            return;
          }

          this.setState({
            imageUploading: true,
          });

          this.props.onImageUpload(blob, this.disableAndInsertImage, () =>
            this.setState({
              imageUploading: false,
            }),
          );
        }
      });
    }
  }

  handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      if (!isValidImage(e.target.files[0])) {
        this.props.onImageInvalid();
        return;
      }

      this.setState({
        imageUploading: true,
      });

      this.props.onImageUpload(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          imageUploading: false,
        }),
      );
      e.target.value = '';
    }
  }

  handleDrop(files) {
    if (files.length === 0) {
      this.setState({
        dropzoneActive: false,
      });
      return;
    }

    this.setState({
      dropzoneActive: false,
      imageUploading: true,
    });
    let callbacksCount = 0;
    Array.from(files).forEach(item => {
      this.props.onImageUpload(
        item,
        (image, imageName) => {
          callbacksCount += 1;
          this.insertImage(image, imageName);
          if (callbacksCount === files.length) {
            this.setState({
              imageUploading: false,
            });
          }
        },
        () => {
          this.setState({
            imageUploading: false,
          });
        },
      );
    });
  }

  handleDragEnter() {
    this.setState({ dropzoneActive: true });
  }

  handleDragLeave() {
    this.setState({ dropzoneActive: false });
  }

  handleChange(e) {
    const { value } = e.target;
    this.setValue(value);
  }

  render() {
    const { addon, value, ...restProps } = this.props;
    const { dropzoneActive } = this.state;

    return (
      <React.Fragment>
        <EditorToolbar onSelect={this.insertCode} />
        <div className="EditorInput__dropzone-base">
          <Dropzone
            disableClick
            style={{}}
            accept="image/*"
            maxSize={MAXIMUM_UPLOAD_SIZE}
            onDropRejected={this.props.onImageInvalid}
            onDrop={this.handleDrop}
            onDragEnter={this.handleDragEnter}
            onDragLeave={this.handleDragLeave}
          >
            {dropzoneActive && (
              <div className="EditorInput__dropzone">
                <div>
                  <i className="iconfont icon-picture" />
                  <FormattedMessage id="drop_image" defaultMessage="Drop your images here" />
                </div>
              </div>
            )}
            <HotKeys keyMap={this.constructor.hotkeys} handlers={this.handlers}>
              <Input.TextArea
                {...restProps}
                onChange={this.handleChange}
                value={value}
                ref={this.setInput}
              />
            </HotKeys>
          </Dropzone>
        </div>
        <p className="EditorInput__imagebox">
          <input
            type="file"
            id={this.props.inputId || 'inputfile'}
            accept="image/*"
            onChange={this.handleImageChange}
          />
          <label htmlFor={this.props.inputId || 'inputfile'}>
            {this.state.imageUploading ? (
              <Icon type="loading" />
            ) : (
              <i className="iconfont icon-picture" />
            )}
            {this.state.imageUploading ? (
              <FormattedMessage id="image_uploading" defaultMessage="Uploading your image..." />
            ) : (
              <FormattedMessage
                id="select_or_past_image"
                defaultMessage="Select image or paste it from the clipboard."
              />
            )}
          </label>
          <label htmlFor="reading_time" className="EditorInput__addon">
            {addon}
          </label>
        </p>
      </React.Fragment>
    );
  }
}

export default EditorInput;
