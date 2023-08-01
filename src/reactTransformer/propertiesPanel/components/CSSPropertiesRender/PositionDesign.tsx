import React from 'react';
import { Form, Input } from 'antd';

export default () => {
  return <Form>
    <Form.Item label="Width" name="width">
      <Input />
    </Form.Item>
    <Form.Item label="Height" name="height">
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