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
    this.input.addEventListener('input', throttle((e) => {
      this.setState({
        contentHtml: remarkable.render(e.target.value),
      });
    }, 500));
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

  insertCode = (type) => {
    if (!this.input) {
      return;
    }

    let addedText = '';
    let cursorDiff = 0;

    switch (type) {
      case 'h1':
        addedText = '# ';
        break;
      case 'h2':
        addedText = '## ';
        break;
      case 'h3':
        addedText = '### ';
        break;
      case 'h4':
        addedText = '#### ';
        break;
      case 'h5':
        addedText = '##### ';
        break;
      case 'h6':
        addedText = '###### ';
        break;
      case 'b':
        addedText = '****';
        cursorDiff = 2;
        break;
      case 'i':
        addedText = '**';
        cursorDiff = 1;
        break;
      case 'u':
        addedText = '____';
        cursorDiff = 2;
        break;
      case 'q':
        addedText = '> ';
        break;
      case 'link':
        addedText = '[](url)';
        cursorDiff = 6;
        break;
      case 'image':
        addedText = '![](url)';
        cursorDiff = 6;
        break;
      default:
        break;
    }

    this.input.focus();
    this.input.value = `${this.input.value}${addedText}`;
    this.input.selectionEnd -= cursorDiff;
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
            <Button className="Editor__toolbar__button" onClick={() => this.insertCode('u')}>U</Button>
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
