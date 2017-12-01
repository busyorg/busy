import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import marked from 'marked';
import { HotKeys } from 'react-hotkeys';
import { Input } from 'antd';
import uuidv4 from 'uuid/v4';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getAuthenticatedUser, getIsEditorLoading } from '../../reducers';
import { isValidImage, MAXIMUM_UPLOAD_SIZE, MAXIMUM_UPLOAD_SIZE_HUMAN } from '../../helpers/image';
import { notify } from '../../app/Notification/notificationActions';
import { createPost } from '../../post/Write/editorActions';
import Avatar from '../Avatar';
import Body, { remarkable } from '../Story/Body';
import QuickPostEditorHeader from './QuickPostEditorHeader';
import QuickPostEditorFooter from './QuickPostEditorFooter';
import './QuickPostEditor.less';

const version = require('../../../../package.json').version;

@withRouter
@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    postCreationLoading: getIsEditorLoading(state),
  }),
  {
    notify,
    createPost,
  },
)
class QuickPostEditor extends React.Component {
  static propTypes = {
    postCreationLoading: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    user: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    onImageInvalid: () => {},
    onImageInserted: () => {},
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

  state = {
    contentHtml: '',
    noContent: false,
    imageUploading: false,
    dropzoneActive: false,
    selectedPreview: false,
    currentInputValue: '',
  };

  setInput = (input) => {
    if (input && input.refs && input.refs.input) {
      this.originalInput = input.refs.input;
      // eslint-disable-next-line react/no-find-dom-node
      this.input = ReactDOM.findDOMNode(input.refs.input);
    }
  };

  setInputCursorPosition = (pos) => {
    if (this.input && this.input.setSelectionRange) {
      this.input.setSelectionRange(pos, pos);
    }
  };

  getQuickPostData = () => {
    const currentPaths = this.props.location.pathname.split('/');
    const busyTag = 'busy';
    const tag = currentPaths[2];
    const tags = [busyTag];
    const users = [];
    const userRegex = /@([a-zA-Z.0-9-]+)/g;
    const links = [];
    const images = [];
    const postBody = this.state.currentInputValue;
    const data = {
      body: postBody,
      title: ' ',
      reward: '50',
      author: this.props.user.name,
      parentAuthor: '',
      lastUpdated: Date.now(),
      upvote: true,
    };
    const renderer = new marked.Renderer();
    let matches;

    // eslint-disable-next-line
    while ((matches = userRegex.exec(postBody))) {
      if (users.indexOf(matches[1]) === -1) {
        users.push(matches[1]);
      }
    }

    renderer.link = (href) => {
      links.push(href);
      return marked.Renderer.prototype.link.apply(renderer, arguments);
    };

    renderer.image = (href) => {
      images.push(href);
      return marked.Renderer.prototype.image.apply(renderer, arguments);
    };

    marked(postBody || '', { renderer });

    const metaData = {
      community: 'busy',
      app: `busy/${version}`,
      format: 'markdown',
    };

    if (users.length) {
      metaData.users = users;
    }

    if (links.length) {
      metaData.links = links;
    }

    if (images.length) {
      metaData.image = images;
    }

    if (!_.isEmpty(tag)) {
      tags.push(tag);
    }

    metaData.tags = _.uniq(tags);

    data.parentPermlink = _.isEmpty(tag) ? busyTag : tag;
    data.permlink = `busy-quick-post-${uuidv4()}`;
    data.jsonMetadata = metaData;

    return data;
  };

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
    link: (e) => {
      e.preventDefault();
      this.insertCode('link');
    },
    image: () => this.insertCode('image'),
  };

  resizeTextarea = () => {
    if (this.originalInput) this.originalInput.resizeTextarea();
  };

  insertImage = (image, imageName = 'image') => {
    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    const imageText = `![${imageName}](${image})\n`;
    const currentInputValue = this.state.currentInputValue;
    const newInputValue = `${currentInputValue.substring(0, startPos)}${imageText}${currentInputValue.substring(endPos, currentInputValue.length)}`;
    this.setState({
      currentInputValue: newInputValue,
      contentHtml: remarkable.render(newInputValue),
    });
    this.resizeTextarea();
    this.setInputCursorPosition(startPos + imageText.length);
  };

  handleDrop = (files) => {
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
    Array.from(files).forEach((item) => {
      this.handleImageInserted(
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
  };

  handleImageInserted = (blob, callback, errorCallback) => {
    this.props.notify(
      this.props.intl.formatMessage({
        id: 'notify_uploading_image',
        defaultMessage: 'Uploading image',
      }),
      'info',
    );
    const formData = new FormData();
    formData.append('files', blob);

    fetch(`https://busy-img.herokuapp.com/@${this.props.user.name}/uploads`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(res => callback(res.secure_url, blob.name))
      .catch(() => {
        errorCallback();
        this.props.notify(
          this.props.intl.formatMessage({
            id: 'notify_uploading_iamge_error',
            defaultMessage: "Couldn't upload image",
          }),
          'error',
        );
      });
  };

  handleImageInvalid = () => {
    this.props.notify(
      this.props.intl.formatMessage(
        {
          id: 'notify_uploading_image_invalid',
          defaultMessage: 'This file is invalid. Only image files with maximum size of {size} are supported',
        },
        { size: MAXIMUM_UPLOAD_SIZE_HUMAN },
      ),
      'error',
    );
  };

  handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (!isValidImage(e.target.files[0])) {
        this.handleImageInvalid();
        return;
      }

      this.setState({
        imageUploading: true,
      });
      this.handleImageInserted(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          imageUploading: false,
        }),
      );
      // Input reacts on value change, so if user selects the same file nothing will happen.
      // We have to reset its value, so if same image is selected it will emit onChange event.
      e.target.value = '';
    }
  };

  handleDragEnter = () => this.setState({ dropzoneActive: true });
  handleDragLeave = () => this.setState({ dropzoneActive: false });

  disableAndInsertImage = (image, imageName = 'image') => {
    this.setState({
      imageUploading: false,
    });
    this.insertImage(image, imageName);
  };

  handleCreatePost = () => {
    if (_.isEmpty(this.state.currentInputValue)) {
      this.props.notify(
        this.props.intl.formatMessage({
          id: 'post_error_empty',
          defaultMessage: 'Post content cannot be empty.',
        }),
        'error',
      );
      return;
    }
    const data = this.getQuickPostData();
    this.props.createPost(data);
  };

  handleUpdateCurrentInputValue = e =>
    this.setState({
      currentInputValue: e.target.value,
      contentHtml: remarkable.render(e.target.value),
    });

  toggleSelectedPreview = selectedPreview => this.setState({ selectedPreview });

  renderCreatePostInput = () => {
    const { user, intl } = this.props;
    if (!this.state.selectedPreview) {
      return (
        <div className="QuickPostEditor__contents">
          <div className="QuickPostEditor__avatar">
            <Avatar username={user.name} />
          </div>
          <div className="QuickPostEditor__dropzone-base">
            <Dropzone
              disableClick
              style={{ flex: 1 }}
              accept="image/*"
              maxSize={MAXIMUM_UPLOAD_SIZE}
              onDropRejected={this.handleImageInvalid}
              onDrop={this.handleDrop}
              onDragEnter={this.handleDragEnter}
              onDragLeave={this.handleDragLeave}
            >
              {this.state.dropzoneActive &&
                <div className="QuickPostEditor__dropzone">
                  <div>
                    <i className="iconfont icon-picture" />
                    <FormattedMessage id="drop_image" defaultMessage="Drop your images here" />
                  </div>
                </div>}
              <HotKeys keyMap={QuickPostEditor.hotkeys} handlers={this.handlers}>
                <Input
                  autosize={{ minRows: 2, maxRows: 12 }}
                  onChange={this.handleUpdateCurrentInputValue}
                  ref={ref => this.setInput(ref)}
                  type="textarea"
                  placeholder={intl.formatMessage({
                    id: 'write_quick_post',
                    defaultMessage: 'Write quick post',
                  })}
                  value={this.state.currentInputValue}
                />
              </HotKeys>
            </Dropzone>
          </div>
        </div>
      );
    }

    return null;
  };

  render() {
    const { selectedPreview, imageUploading, contentHtml } = this.state;
    const { postCreationLoading, intl } = this.props;
    const displayPreviewOption = !_.isEmpty(contentHtml);

    return (
      <div className="QuickPostEditor">
        <QuickPostEditorHeader
          selectedPreview={selectedPreview}
          displayPreviewOption={displayPreviewOption}
          toggleSelectedPreview={this.toggleSelectedPreview}
        />
        {this.renderCreatePostInput()}
        {selectedPreview &&
          <div className="QuickPostEditor__preview">
            <Body full body={this.state.contentHtml} />
          </div>}
        <QuickPostEditorFooter
          imageUploading={imageUploading}
          postCreationLoading={postCreationLoading}
          handleCreatePost={this.handleCreatePost}
          handleImageChange={this.handleImageChange}
          postText={intl.formatMessage({
            id: 'post_send',
            defaultMessage: 'Post',
          })}
          submittingPostText={intl.formatMessage({
            id: 'post_send_progress',
            defaultMessage: 'Submitting',
          })}
        />
      </div>
    );
  }
}

export default QuickPostEditor;
