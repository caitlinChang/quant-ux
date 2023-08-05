import React from "react";
import { Form } from "antd";
import BorderDesign from "./BorderDesign";

enum CSSProps {
  FONT_SIZE = "fontSize",
  COLOR = "color",

  FILL = "backgroundColor",
  BORDER = "border",
  PADDING = "padding",
  MARGIN = "margin",
  WIDTH = "width",
  HEIGHT = "height",
}
export default () => {
  const [form] = Form.useForm();
  const handleChange = (v) => {
    console.log("onValuesChange = ", v);
  };
  return (
    <div>
      <Form form={form} onValuesChange={handleChange}>
        <Form.Item noStyle>
          <BorderDesign />
        </Form.Item>
      </Form>
    </div>
  );
};
