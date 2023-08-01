import React from 'react';
import { Form, Input } from 'antd';

export default () => {
  return <Form>
    <Form.Item label="内容" name="children">
      <Input />
    </Form.Item>
    <Form.Item label="Color" name="color">
      <Input />
    </Form.Item>
    <Form.Item label="Size" name="font-size">
      <Input />
    </Form.Item>
    <Form.Item label="Weight" name="font-weight">
      <Input />
    </Form.Item>
  </Form>;
}