import React, { PropTypes } from 'react';
import Remarkable from 'remarkable';
import { throttle } from 'lodash';
import { Button, Form, Input, Select } from 'antd';
import Action from '../Button/Action';
import './Editor.less';

const remarkable = new Remarkable();

const Option = Select.Option;
const OptionGroup = Select.OptGroup;

class Editor extends React.Component {
  static propTypes = {
    recentTopics: PropTypes.arrayOf(PropTypes.string),
    popularTopics: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    recentTopics: [],
    popularTopics: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      contentHtml: '',
    };
  }

  componentDidMount() {
    this.input.addEventListener('input', throttle(e => this.renderMarkdown(e.target.value), 500));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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

  setInput = (input) => {
    this.input = input && input.refs && input.refs.input;
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { recentTopics, popularTopics } = this.props;

    return (
      <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item label={<span className="Editor__label">Title</span>}>
          {getFieldDecorator('userName', {
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
          <Input ref={ref => this.setInput(ref)} type="textarea" placeholder="Write your story..." autosize={{ minRows: 2, maxRows: 10 }} />
          <div className="Editor__toolbar">
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('h1')}>h1</Button>
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('h2')}>h2</Button>
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('h3')}>h3</Button>
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('h4')}>h4</Button>
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('h5')}>h5</Button>
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('h6')}>h6</Button>
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('b')}>B</Button>
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('i')}>I</Button>
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('q')}>"</Button>
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('link')}>Link</Button>
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('image')}>Image</Button>
          </div>
        </Form.Item>
        <div dangerouslySetInnerHTML={{ __html: this.state.contentHtml }} />
        <Form.Item className="Editor__submit">
          <Action text="Submit" />
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Editor);
