import React from 'react';
import { Form, Input } from 'antd';
import ModuleTitle from "./ModuleTitle";

export default () => {
  return (
    <ModuleTitle title="位置" collapse={true}>
      <Form>
        <Form.Item label="Width" name="width">
          <Input />
        </Form.Item>
      </Form>
    </ModuleTitle>
  );
};