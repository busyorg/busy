import React, { PropTypes } from 'react';
import Remarkable from 'remarkable';
import { HotKeys } from 'react-hotkeys';
import { throttle } from 'lodash';
import { Form, Input, Select, Tabs } from 'antd';
import EditorToolbar from './EditorToolbar';
import Action from '../Button/Action';
import './Editor.less';

const remarkable = new Remarkable();

const Option = Select.Option;
const OptionGroup = Select.OptGroup;
const TabPane = Tabs.TabPane;

class Editor extends React.Component {
  static propTypes = {
    recentTopics: PropTypes.arrayOf(PropTypes.string),
    popularTopics: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    onImagePasted: PropTypes.func,
  }

  static defaultProps = {
    recentTopics: [],
    popularTopics: [],
    onSubmit: () => {},
    onError: () => {},
    onImagePasted: () => {},
  }

  state = {
    contentHtml: '',
  }

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
    this.input.addEventListener('input', throttle(e => this.renderMarkdown(e.target.value), 500));
    this.input.addEventListener('paste', this.handlePastedImage);
  }

  setInput = (input) => {
    this.input = input && input.refs && input.refs.input;
  };

  //
  // Form validation and handling
  //

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit({
          ...values,
          body: this.input.value,
        });
      } else {
        this.props.onError(err);
      }
    });
  }

  checkTopics = (rule, value, callback) => {
    if (value && value.length >= 1 && value.length <= 5) {
      callback();
    } else {
      callback('You have to add 1 to 5 topics.');
    }
  }

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
            this.props.onImagePasted(event.target.result, () => this.insertImage('https://placehold.it/200x200'));
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
    this.input.value = this.input.value.substring(0, startPos)
      + before
      + this.input.value.substring(startPos, endPos)
      + after
      + this.input.value.substring(endPos, this.input.value.length);

    this.input.selectionStart = startPos + deltaStart;
    this.input.selectionEnd = endPos + deltaEnd;
  }

  insertImage = (image) => {
    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    this.input.value = `${this.input.value.substring(0, startPos)}![image](${image})${this.input.value.substring(endPos, this.input.value.length)}`;

    this.renderMarkdown(this.input.value);
  }

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
  }

  renderMarkdown = (value) => {
    this.setState({
      contentHtml: remarkable.render(value),
    });
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
    link: (e) => {
      e.preventDefault();
      this.insertCode('link');
    },
    image: () => this.insertCode('image'),
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { recentTopics, popularTopics } = this.props;

    return (
      <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item label={<span className="Editor__label">Title</span>}>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please enter a title.' }],
          })(
            <Input className="Editor__title" placeholder="Add title" />
            )}
        </Form.Item>
        <Form.Item
          label={<span className="Editor__label">Topics</span>}
          extra="Separate topics with commas."
        >
          {getFieldDecorator('topics', {
            rules: [
              { required: true, message: 'Please enter topics.', type: 'array' },
              { validator: this.checkTopics },
            ],
          })(
            <Select
              mode="tags"
              placeholder="Add story topics here"
              notFoundContent="No such topic found. Just type your topics and separate them with commas."
              tokenSeparators={[' ', ',']}
            >
              <OptionGroup key="recent" label={<b>Recent</b>}>
                {recentTopics && recentTopics.map(topic => <Option key={topic}>{topic}</Option>)}
              </OptionGroup>
              <OptionGroup key="popular" label={<b>Popular</b>}>
                {popularTopics && popularTopics.map(topic => <Option key={topic}>{topic}</Option>)}
              </OptionGroup>
            </Select>
            )}
        </Form.Item>
        <Form.Item label={<span className="Editor__label">Write your story</span>}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Editor" key="1">
              <HotKeys keyMap={Editor.hotkeys} handlers={this.handlers}>
                <Input ref={ref => this.setInput(ref)} type="textarea" placeholder="Write your story..." autosize={{ minRows: 2, maxRows: 10 }} />
              </HotKeys>
              <EditorToolbar onSelect={this.insertCode} />
            </TabPane>
            <TabPane tab="Preview" key="2">
              <div dangerouslySetInnerHTML={{ __html: this.state.contentHtml }} />
            </TabPane>
          </Tabs>
        </Form.Item>
        <Form.Item className="Editor__submit">
          <Action text="Submit" />
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Editor);
