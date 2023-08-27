import React, { useEffect } from "react";
import { Form } from "antd";
import BorderDesign from "./BorderDesign";
import BackgroundDesign from "./BackgroundDesign";
import TextDesign from "./TextDesign";
import SizeDesign from "./SizeDesign";
import SpacingDesign from "./SpacingDesign";
import PositionDesign from "./PositionDesign";

export default (props?: { value?: any; onChange?: (v: any) => void }) => {
  const [form] = Form.useForm();
  const {
    border,
    borderTop,
    borderLeft,
    borderRight,
    borderBottom,
    backgroundColor,
    ...rest
  } = props?.value || {};

  const initialValues = {
    border: {
      borderTop,
      borderLeft,
      borderRight,
      borderBottom,
    },
    background: {
      backgroundColor,
    },
    ...rest,
  };

  const handleChange = (_, allValues) => {
    const { border, background, ...rest } = allValues;
    const _value = {
      ...(border || {}),
      ...(background || {}),
      ...rest,
    };
    Object.keys(_value).forEach((i) => {
      if (!_value[i]) {
        delete _value[i];
      }
    });
    if (Object.keys(_value).length === 0) {
      props?.onChange?.(undefined);
      return;
    }
    props?.onChange?.(_value);
  };
  return (
    <Form
      id="Widget_Design_Panel"
      initialValues={initialValues}
      form={form}
      size="small"
      labelAlign="left"
      labelCol={{ span: 9 }}
      onValuesChange={handleChange}
    >
      <TextDesign />
      <SizeDesign form={form} />
      <SpacingDesign form={form} />
      <Form.Item noStyle name="border">
        <BorderDesign />
      </Form.Item>
      <Form.Item noStyle name="background">
        <BackgroundDesign />
      </Form.Item>
      {/* <Form.Item noStyle>
        <PositionDesign />
      </Form.Item> */}
    </Form>
  );
};
