import React from "react";
import { Form } from "antd";
import BorderDesign from "./BorderDesign";
import BackgroundDesign from "./BackgroundDesign";
import TextDesign from "./TextDesign";
import SizeDesign from "./SizeDesign";
import SpacingDesign from "./SpacingDesign";

export default () => {
  const [form] = Form.useForm();
  const handleChange = (v) => {
    console.log("onValuesChange = ", v);
  };
  return (
    <Form form={form} onValuesChange={handleChange}>
      <Form.Item noStyle>
        <TextDesign />
      </Form.Item>
      <Form.Item noStyle>
        <SizeDesign />
      </Form.Item>
      <Form.Item noStyle>
        <SpacingDesign />
      </Form.Item>
      <Form.Item noStyle>
        <BorderDesign />
      </Form.Item>
      <Form.Item noStyle>
        <BackgroundDesign />
      </Form.Item>
    </Form>
  );
};
