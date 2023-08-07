import React, { useEffect } from "react";
import { Form, Input, Select } from "antd";
import ModuleTitle from "./ModuleTitle";
import ColorDesign from "./ColorDesign";
import { use } from "vue/types/umd";

const widthList = () => {
  const list = [];
  for (let i = 12; i < 48; i = i + 2) {
    list.push({ label: `${i}px`, value: `${i}px` });
  }
  return list;
};

const weightList = () => {
  return [
    { label: "Normal", value: "normal" },
    { label: "Bold", value: "bold" },
    { label: "Bolder", value: "bolder" },
    { label: "Lighter", value: "lighter" },
    { label: "100", value: 100 },
    { label: "200", value: 200 },
    { label: "300", value: 300 },
    { label: "400", value: 400 },
    { label: "500", value: 500 },
    { label: "600", value: 600 },
    { label: "700", value: 700 },
    { label: "800", value: 800 },
    { label: "900", value: 900 },
  ];
};

export default (props?: { value?: any; onChange?: (v: any) => void }) => {
  console.log("TextDesign props = ", props.value);
  const [form] = Form.useForm();
  useEffect(() => {
    if (props?.value) {
      form.setFieldsValue({
        color: props.value.color,
        fontSize: props.value.fontSize,
        fontWeight: props.value.fontWeight,
      });
    }
  }, [props?.value]);
  return (
    <ModuleTitle title="文本" collapse={true}>
      <Form
        id="TextDesign"
        size="small"
        labelAlign="left"
        form={form}
        labelCol={{ span: 9 }}
        onValuesChange={(v, allValues) => {
          props?.onChange?.(allValues);
        }}
        initialValues={props.value}
      >
        {/* <Form.Item label="内容" name="children">
        <Input />
      </Form.Item> */}
        <Form.Item style={{ margin: "5px 0" }} label="Color" name="color">
          <ColorDesign />
        </Form.Item>
        <Form.Item style={{ margin: "5px 0" }} label="Size" name="fontSize">
          <Select
            getPopupContainer={() => document.getElementById("TextDesign")}
            options={widthList()}
          />
        </Form.Item>
        <Form.Item style={{ margin: "5px 0" }} label="Weight" name="fontWeight">
          <Select
            getPopupContainer={() => document.getElementById("TextDesign")}
            options={weightList()}
            defaultValue="normal"
          />
        </Form.Item>
      </Form>
    </ModuleTitle>
  );
};
