import React from 'react';
import { Form, Input } from 'antd';
import Action from '../Button/Action';
import './Editor.less';

const Editor = ({ form }) =>
  <Form className="Editor" layout="vertical">
    <Form.Item label={<span className="Editor__label">Title</span>}>
      {form.getFieldDecorator('userName', {
        rules: [{ required: true, message: 'Please enter a title' }],
      })(
        <Input className="Editor__title" placeholder="Add title" />
      )}
    </Form.Item>
    <Form.Item label={<span className="Editor__label">Topics</span>}>
      <Input className="Editor__topics" placeholder="Add story topics here" />
    </Form.Item>
    <Form.Item label={<span className="Editor__label">Write your story</span>}>
      <Input type="textarea" placeholder="Write your story..." autosize={{ minRows: 2, maxRows: 10 }} />
    </Form.Item>
    <Form.Item className="Editor__submit">
      <Action text="Submit" />
    </Form.Item>
  </Form>;

export default Form.create()(Editor);
