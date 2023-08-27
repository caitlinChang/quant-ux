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
 
  useEffect(() => {
    const {
      border,
      borderTop,
      borderLeft,
      borderRight,
      borderBottom,
      backgroundColor,
      ...rest
    } = props?.value || {};
    form.setFieldsValue({
      border: {
        border,
        borderTop,
        borderLeft,
        borderRight,
        borderBottom,
      },
      background: {
        backgroundColor,
      },
      ...rest,
    });
  }, [props.value]);

  const handleChange = (_, allValues) => {
    // 判断是否值真的发生变化
    let hasChange = false;
    for (let key in _) {
      if (props.value[key] !== _[key]) {
        hasChange = true;
        break;
      }
    }
    if (!hasChange) {
      return;
    }

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
      if (props.value) {
        console.log("Design Panel onChange = ", props.value);
        props?.onChange?.(undefined);
      }
      return;
    }
    props?.onChange?.(_value);
  };
  return (
    <Form
      id="Widget_Design_Panel"
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
