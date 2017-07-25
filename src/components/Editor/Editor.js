import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Remarkable from 'remarkable';
import { HotKeys } from 'react-hotkeys';
import { throttle } from 'lodash';
import isArray from 'lodash/isArray';
import { Checkbox, Form, Input, Select, Tabs } from 'antd';
import EditorToolbar from './EditorToolbar';
import Action from '../Button/Action';
import Body from '../Story/Body';
import './Editor.less';

const remarkable = new Remarkable();

const TabPane = Tabs.TabPane;

class Editor extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.string,
    reward: PropTypes.string,
    upvote: PropTypes.bool,
    loading: PropTypes.bool,
    onUpdate: PropTypes.func,
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    onImagePasted: PropTypes.func,
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
    onUpdate: () => {},
    onSubmit: () => {},
    onError: () => {},
    onImagePasted: () => {},
  };

  state = {
    contentHtml: '',
    noContent: false,
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
    const { title, topics, body, reward, upvote } = this.props;
    if (title !== nextProps.title
      || topics !== nextProps.topics
      || body !== nextProps.body
      || reward !== nextProps.reward
      || upvote !== nextProps.upvote) {
      this.setValues(nextProps);
    }
  }

  setInput = (input) => {
    if (input && input.refs && input.refs.input) {
      // eslint-disable-next-line react/no-find-dom-node
      this.input = ReactDOM.findDOMNode(input.refs.input);
    }
  };

  onUpdate = (e) => {
    // NOTE: antd doesn't update field value on Select before firing onChange
    // so we have to get value from event.
    this.props.onUpdate(this.getValues(e));
  }

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
    }
  }

  getValues = (e) => {
    // NOTE: antd API is inconsistent and returns event or just value depending of input type.
    // this code extracts value from event based of event type
    // (array or just value for Select, proxy event for inputs and checkboxes)

    const values = {
      ...this.props.form.getFieldsValue(['title', 'topics', 'reward', 'upvote']),
      body: this.input.value,
    };

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
  }

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
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            this.props.onImagePasted(event.target.result, this.insertImage);
          };
          reader.readAsDataURL(blob);
        }
      });
    }
  };

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

  insertImage = (image) => {
    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    this.input.value = `${this.input.value.substring(
      0,
      startPos
    )}![image](${image})${this.input.value.substring(endPos, this.input.value.length)}`;

    this.renderMarkdown(this.input.value);
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

    this.renderMarkdown(this.input.value);
    this.onUpdate();
  };

  renderMarkdown = (value) => {
    this.setState({
      contentHtml: remarkable.render(value),
    });
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;

    return (
      <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item label={<span className="Editor__label">Title</span>}>
          {getFieldDecorator('title', {
            rules: [
              { required: true, message: 'Please enter a title' },
              { max: 255, message: "Title can't be longer than 255 characters" },
            ],
          })(<Input
            ref={(title) => { this.title = title; }}
            onChange={this.onUpdate}
            className="Editor__title"
            placeholder="Add title"
          />)}
        </Form.Item>
        <Form.Item
          label={<span className="Editor__label">Topics</span>}
          extra="Separate topics with commas. Only lowercase letters, numbers and hyphen character is permited."
        >
          {getFieldDecorator('topics', {
            rules: [
              { required: true, message: 'Please enter topics', type: 'array' },
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
              placeholder="Add story topics here"
              dropdownStyle={{ display: 'none' }}
              tokenSeparators={[' ', ',']}
            />
          )}
        </Form.Item>
        <Form.Item
          validateStatus={this.state.noContent ? 'error' : ''}
          help={this.state.noContent ? "Story content can't be empty" : ''}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Editor" key="1">
              <EditorToolbar onSelect={this.insertCode} />
              <HotKeys keyMap={Editor.hotkeys} handlers={this.handlers}>
                <Input
                  onChange={this.onUpdate}
                  ref={ref => this.setInput(ref)}
                  type="textarea"
                  placeholder="Write your story..."
                  autosize={{ minRows: 3, maxRows: 10 }}
                />
              </HotKeys>
              <p>You can upload images just by pasting them.</p>
            </TabPane>
            <TabPane tab="Preview" key="2">
              <Body body={this.state.contentHtml} />
            </TabPane>
          </Tabs>
        </Form.Item>
        <Form.Item
          label={<span className="Editor__label">Reward</span>}
        >
          {getFieldDecorator('reward', { initialValue: '50' })(
            <Select onChange={this.onUpdate}>
              <Select.Option value="100">100% Steem Power</Select.Option>
              <Select.Option value="50">50% SBD and 50% SP</Select.Option>
              <Select.Option value="0">Declined</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('upvote', { valuePropName: 'checked', initialValue: true })(
            <Checkbox onChange={this.onUpdate}>Upvote this post</Checkbox>
          )}
        </Form.Item>
        <div className="Editor__bottom">
          <span className="Editor__bottom__info">Styling with markdown is supported</span>
          <Form.Item className="Editor__bottom__submit">
            <Action disabled={loading} text={(loading) ? 'Submitting' : 'Create new post'} />
          </Form.Item>
        </div>
      </Form>
    );
  }
}

export default Form.create()(Editor);
