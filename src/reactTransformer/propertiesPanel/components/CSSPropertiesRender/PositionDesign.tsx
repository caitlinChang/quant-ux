import React from 'react';
import { Form, Input } from 'antd';
import ModuleTitle from "./ModuleTitle";

export default () => {
  return (
    <ModuleTitle title="Position">
      <Form>
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
      </Form>
      ;
    </ModuleTitle>
  );
};