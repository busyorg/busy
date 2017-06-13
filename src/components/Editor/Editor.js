import React from 'react';
import { Button, Form, Input } from 'antd';
import Action from '../Button/Action';
import './Editor.less';

class Editor extends React.Component {
  insertCode = (type) => {
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
    this.input.selectionEnd = this.input.selectionEnd - cursorDiff;
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="Editor" layout="vertical">
        <Form.Item label={<span className="Editor__label">Title</span>}>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please enter a title' }],
          })(
            <Input className="Editor__title" placeholder="Add title" />
          )}
        </Form.Item>
        <Form.Item label={<span className="Editor__label">Topics</span>}>
          <Input className="Editor__topics" placeholder="Add story topics here" />
        </Form.Item>
        <Form.Item label={<span className="Editor__label">Write your story</span>}>
          <Input ref={(ref) => { this.input = ref.refs.input; }} type="textarea" placeholder="Write your story..." autosize={{ minRows: 2, maxRows: 10 }} />
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
        <Form.Item className="Editor__submit">
          <Action text="Submit" />
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Editor);
