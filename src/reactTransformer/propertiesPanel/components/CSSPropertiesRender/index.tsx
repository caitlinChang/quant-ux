import React, { useEffect } from "react";
import { Form } from "antd";
import BorderDesign from "./BorderDesign";
import BackgroundDesign from "./BackgroundDesign";
import TextDesign from "./TextDesign";
import SizeDesign from "./SizeDesign";
import SpacingDesign from "./SpacingDesign";
import PositionDesign from "./PositionDesign";

export default (props?: { value?: any; onChange?: (v: any) => void }) => {
  console.log("props.value = ", props.value);
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.value) {
      form.setFieldsValue({
        text: props.value,
        size: props.value,
        spacing: props.value,
        border: props.value,
        background: props.value,
      });
    }
  }, [props.value]);

  const handleChange = (v, allValues) => {
    const values = Object.values(allValues)
      .filter((i) => i)
      .map((i: any) => {
        const obj = {};
        for (let key in i) {
          if (i[key]) {
            obj[key] = i[key];
          }
        }
        return obj;
      })
      .reduce((prev, cur) => {
        return { ...prev, ...cur };
      }, {});

    console.log("onValuesChange = ", values);
    props?.onChange?.(values);
  };
  return (
    <Form form={form} onValuesChange={handleChange}>
      <Form.Item noStyle name="text">
        <TextDesign />
      </Form.Item>
      <Form.Item noStyle name="size">
        <SizeDesign />
      </Form.Item>
      <Form.Item noStyle name="spacing">
        <SpacingDesign />
      </Form.Item>
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
