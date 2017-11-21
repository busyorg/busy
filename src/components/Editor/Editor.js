import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import readingTime from 'reading-time';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { HotKeys } from 'react-hotkeys';
import { throttle, isEqual } from 'lodash';
import isArray from 'lodash/isArray';
import { Icon, Checkbox, Form, Input, Select, Button } from 'antd';
import Dropzone from 'react-dropzone';
import { isValidImage, MAXIMUM_UPLOAD_SIZE } from '../../helpers/image';
import EditorToolbar from './EditorToolbar';
import Action from '../Button/Action';
import Body, { remarkable } from '../Story/Body';
import './Editor.less';

@injectIntl
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    title: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.string,
    reward: PropTypes.string,
    upvote: PropTypes.bool,
    loading: PropTypes.bool,
    isUpdating: PropTypes.bool,
    draftId: PropTypes.string,
    saving: PropTypes.bool,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    onImageInserted: PropTypes.func,
    onImageInvalid: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    topics: [],
    body: '',
    reward: '50',
    upvote: true,
    recentTopics: [],
    popularTopics: [],
    loading: false,
    isUpdating: false,
    saving: false,
    draftId: null,
    onDelete: () => {},
    onUpdate: () => {},
    onSubmit: () => {},
    onError: () => {},
    onImageInserted: () => {},
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

  state = {
    contentHtml: '',
    noContent: false,
    imageUploading: false,
    dropzoneActive: false,
  };

  componentDidMount() {
    if (this.input) {
      this.input.addEventListener('input', throttle(e => this.renderMarkdown(e.target.value), 500));
      this.input.addEventListener('paste', this.handlePastedImage);
    }

    this.setValues(this.props);

    // eslint-disable-next-line react/no-find-dom-node
    const select = ReactDOM.findDOMNode(this.select);
    if (select) {
      const selectInput = select.querySelector('input,textarea,div[contentEditable]');
      if (selectInput) {
        selectInput.setAttribute('autocorrect', 'off');
        selectInput.setAttribute('autocapitalize', 'none');
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { title, topics, body, reward, upvote, draftId } = this.props;
    if (
      title !== nextProps.title ||
      !isEqual(topics, nextProps.topics) ||
      body !== nextProps.body ||
      reward !== nextProps.reward ||
      upvote !== nextProps.upvote ||
      (draftId && nextProps.draftId === null)
    ) {
      this.setValues(nextProps);
    }
  }

  onUpdate = (e) => {
    // NOTE: antd doesn't update field value on Select before firing onChange
    // so we have to get value from event.
    const values = this.getValues(e);
    const topics = values.topics || [];
    const title = values.title || '';

    this.props.onUpdate({
      ...values,
      topics: topics.slice(0, 5),
      title: title.slice(0, 255),
    });
  };

  setInput = (input) => {
    if (input && input.refs && input.refs.input) {
      this.originalInput = input.refs.input;
      // eslint-disable-next-line react/no-find-dom-node
      this.input = ReactDOM.findDOMNode(input.refs.input);
    }
  };

  setValues = (post) => {
    this.props.form.setFieldsValue({
      title: post.title,
      topics: post.topics,
      reward: post.reward,
      upvote: post.upvote,
    });
    if (this.input) {
      this.input.value = post.body;
      this.renderMarkdown(this.input.value);
      this.resizeTextarea();
    }
  };

  getValues = (e) => {
    // NOTE: antd API is inconsistent and returns event or just value depending of input type.
    // this code extracts value from event based of event type
    // (array or just value for Select, proxy event for inputs and checkboxes)

    const values = {
      ...this.props.form.getFieldsValue(['title', 'topics', 'reward', 'upvote']),
      body: this.input.value,
    };

    if (!e) return values;

    if (isArray(e)) {
      values.topics = e;
    } else if (typeof e === 'string') {
      values.reward = e;
    } else if (e.target.type === 'textarea') {
      values.body = e.target.value;
    } else if (e.target.type === 'text') {
      values.title = e.target.value;
    } else if (e.target.type === 'checkbox') {
      values.upvote = e.target.checked;
    }

    return values;
  };

  setInputCursorPosition = (pos) => {
    if (this.input && this.input.setSelectionRange) {
      this.input.setSelectionRange(pos, pos);
    }
  };

  resizeTextarea = () => {
    if (this.originalInput) this.originalInput.resizeTextarea();
  };

  //
  // Form validation and handling
  //

  handleSubmit = (e) => {
    // NOTE: Wrapping textarea in getFormDecorator makes it impossible
    // to control its selection what is needed for markdown formatting.
    // This code adds requirement for body input to not be empty.
    e.preventDefault();
    this.setState({ noContent: false });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && this.input.value !== '') {
        this.props.onSubmit({
          ...values,
          body: this.input.value,
        });
      } else if (this.input.value === '') {
        const errors = {
          ...err,
          body: {
            errors: [
              {
                field: 'body',
                message: "Content can't be empty",
              },
            ],
          },
        };
        this.setState({ noContent: true });
        this.props.onError(errors);
      } else {
        this.props.onError(err);
      }
    });
  };

  checkTopics = (rule, value, callback) => {
    if (!value || value.length < 1 || value.length > 5) {
      callback('You have to add 1 to 5 topics');
    }

    value
      .map(topic => ({ topic, valid: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(topic) }))
      .filter(topic => !topic.valid)
      .map(topic => callback(`Topic ${topic.topic} is invalid`));

    callback();
  };

  //
  // Editor methods
  //

  handlePastedImage = (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      Array.from(items).forEach((item) => {
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

          this.props.onImageInserted(blob, this.disableAndInsertImage, () =>
            this.setState({
              imageUploading: false,
            }),
          );
        }
      });
    }
  };

  handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (!isValidImage(e.target.files[0])) {
        this.props.onImageInvalid();
        return;
      }

      this.setState({
        imageUploading: true,
      });
      this.props.onImageInserted(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          imageUploading: false,
        }),
      );
      // Input reacts on value change, so if user selects the same file nothing will happen.
      // We have to reset its value, so if same image is selected it will emit onChange event.
      e.target.value = '';
    }
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
      this.props.onImageInserted(
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

  handleDragEnter = () => this.setState({ dropzoneActive: true });

  handleDragLeave = () => this.setState({ dropzoneActive: false });

  handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.onDelete();
  }

  insertAtCursor = (before, after, deltaStart = 0, deltaEnd = 0) => {
    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    this.input.value =
      this.input.value.substring(0, startPos) +
      before +
      this.input.value.substring(startPos, endPos) +
      after +
      this.input.value.substring(endPos, this.input.value.length);

    this.input.selectionStart = startPos + deltaStart;
    this.input.selectionEnd = endPos + deltaEnd;
  };

  disableAndInsertImage = (image, imageName = 'image') => {
    this.setState({
      imageUploading: false,
    });
    this.insertImage(image, imageName);
  };

  insertImage = (image, imageName = 'image') => {
    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    const imageText = `![${imageName}](${image})\n`;
    this.input.value = `${this.input.value.substring(
      0,
      startPos,
    )}${imageText}${this.input.value.substring(endPos, this.input.value.length)}`;
    this.resizeTextarea();
    this.renderMarkdown(this.input.value);
    this.setInputCursorPosition(startPos + imageText.length);
    this.onUpdate();
  };

  insertCode = (type) => {
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
    this.renderMarkdown(this.input.value);
    this.onUpdate();
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

  renderMarkdown = (value) => {
    this.setState({
      contentHtml: remarkable.render(value),
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { intl, loading, isUpdating, saving, draftId } = this.props;

    return (
      <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item
          label={
            <span className="Editor__label">
              <FormattedMessage id="title" defaultMessage="Title" />
            </span>
          }
        >
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'title_error_empty',
                  defaultMessage: 'title_error_empty',
                }),
              },
              {
                max: 255,
                message: intl.formatMessage({
                  id: 'title_error_too_long',
                  defaultMessage: "Title can't be longer than 255 characters.",
                }),
              },
            ],
          })(
            <Input
              ref={(title) => {
                this.title = title;
              }}
              onChange={this.onUpdate}
              className="Editor__title"
              placeholder={intl.formatMessage({
                id: 'title_placeholder',
                defaultMessage: 'Add title',
              })}
            />,
          )}
        </Form.Item>
        <Form.Item
          label={
            <span className="Editor__label">
              <FormattedMessage id="topics" defaultMessage="Topics" />
            </span>
          }
          extra={intl.formatMessage({
            id: 'topics_extra',
            defaultMessage:
              'Separate topics with commas. Only lowercase letters, numbers and hyphen character is permitted.',
          })}
        >
          {getFieldDecorator('topics', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'topics_error_empty',
                  defaultMessage: 'Please enter topics',
                }),
                type: 'array',
              },
              { validator: this.checkTopics },
            ],
          })(
            <Select
              ref={(ref) => {
                this.select = ref;
              }}
              onChange={this.onUpdate}
              className="Editor__topics"
              mode="tags"
              placeholder={intl.formatMessage({
                id: 'topics_placeholder',
                defaultMessage: 'Add story topics here',
              })}
              dropdownStyle={{ display: 'none' }}
              tokenSeparators={[' ', ',']}
            />,
          )}
        </Form.Item>
        <Form.Item
          validateStatus={this.state.noContent ? 'error' : ''}
          help={
            this.state.noContent &&
            intl.formatMessage({
              id: 'story_error_empty',
              defaultMessage: "Story content can't be empty.",
            })
          }
        >
          <EditorToolbar onSelect={this.insertCode} />
          <div className="Editor__dropzone-base">
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
              {this.state.dropzoneActive && (
                <div className="Editor__dropzone">
                  <div>
                    <i className="iconfont icon-picture" />
                    <FormattedMessage id="drop_image" defaultMessage="Drop your images here" />
                  </div>
                </div>
              )}
              <HotKeys keyMap={Editor.hotkeys} handlers={this.handlers}>
                <Input
                  autosize={{ minRows: 6, maxRows: 12 }}
                  onChange={this.onUpdate}
                  ref={ref => this.setInput(ref)}
                  type="textarea"
                  placeholder={intl.formatMessage({
                    id: 'story_placeholder',
                    defaultMessage: 'Write your story...',
                  })}
                />
              </HotKeys>
            </Dropzone>
          </div>
          <p className="Editor__imagebox">
            <input type="file" id="inputfile" accept="image/*" onChange={this.handleImageChange} />
            <label htmlFor="inputfile">
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
            <label htmlFor="reading_time" className="Editor__reading_time">
              <FormattedMessage
                id="reading_time"
                defaultMessage={'{words} words / {min} min read'}
                values={{
                  words: readingTime(this.state.contentHtml).words,
                  min: Math.ceil(readingTime(this.state.contentHtml).minutes),
                }}
              />
            </label>
          </p>
        </Form.Item>
        {this.state.contentHtml && (
          <Form.Item
            label={
              <span className="Editor__label">
                <FormattedMessage id="preview" defaultMessage="Preview" />
              </span>
            }
          >
            <Body full body={this.state.contentHtml} />
          </Form.Item>
        )}
        <Form.Item
          className={classNames({ Editor__hidden: isUpdating })}
          label={
            <span className="Editor__label">
              <FormattedMessage id="reward" defaultMessage="Reward" />
            </span>
          }
        >
          {getFieldDecorator('reward', { initialValue: '50' })(
            <Select onChange={this.onUpdate} disabled={isUpdating}>
              <Select.Option value="100">
                <FormattedMessage id="reward_option_100" defaultMessage="100% Steem Power" />
              </Select.Option>
              <Select.Option value="50">
                <FormattedMessage id="reward_option_50" defaultMessage="50% SBD and 50% SP" />
              </Select.Option>
              <Select.Option value="0">
                <FormattedMessage id="reward_option_0" defaultMessage="Declined" />
              </Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item className={classNames({ Editor__hidden: isUpdating })}>
          {getFieldDecorator('upvote', { valuePropName: 'checked', initialValue: true })(
            <Checkbox onChange={this.onUpdate} disabled={isUpdating}>
              <FormattedMessage id="like_post" defaultMessage="Like this post" />
            </Checkbox>,
          )}
        </Form.Item>
        <div className="Editor__bottom">
          <span className="Editor__bottom__info">
            <i className="iconfont icon-markdown" />{' '}
            <FormattedMessage
              id="markdown_supported"
              defaultMessage="Styling with markdown supported"
            />
          </span>
          <div className="Editor__bottom__right">
            {saving && (
              <span className="Editor__bottom__right__saving">
                <FormattedMessage id="saving" defaultMessage="Saving..." />
              </span>
            )}
            <Form.Item className="Editor__bottom__cancel">
              {draftId &&
              <Button
                type="danger"
                disabled={loading}
                onClick={this.handleDelete}
              >
                <FormattedMessage id="draft_delete" defaultMessage="Delete this draft" />
              </Button>}
            </Form.Item>
            <Form.Item className="Editor__bottom__submit">
              {isUpdating ? (
                <Action
                  primary
                  loading={loading}
                  disabled={loading}
                  text={intl.formatMessage({
                    id: loading ? 'post_send_progress' : 'post_update_send',
                    defaultMessage: loading ? 'Submitting' : 'Update post',
                  })}
                />
              ) : (
                <Action
                  primary
                  loading={loading}
                  disabled={loading}
                  text={intl.formatMessage({
                    id: loading ? 'post_send_progress' : 'post_send',
                    defaultMessage: loading ? 'Submitting' : 'Post',
                  })}
                />
              )}
            </Form.Item>
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create()(Editor);
