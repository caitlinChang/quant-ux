import React from 'react';
import { Form, Input, Select } from "antd";
import ModuleTitle from "./ModuleTitle";
import ColorDesign from "./ColorDesign";

const widthList = () => {
  const list = [];
  for (let i = 12; i < 10; i = i + 2) {
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

export default () => {
  return (
    <ModuleTitle title="文本" collapse={true}>
      <Form
        id="TextDesign"
        size="small"
        labelAlign="left"
        labelCol={{ span: 9 }}
      >
        {/* <Form.Item label="内容" name="children">
        <Input />
      </Form.Item> */}
        <Form.Item label="Color" name="color">
          <ColorDesign />
        </Form.Item>
        <Form.Item label="Size" name="fontSize">
          <Select
            getPopupContainer={() => document.getElementById("TextDesign")}
            options={widthList()}
          />
        </Form.Item>
        <Form.Item label="Weight" name="fontWeight">
          <Select
            getPopupContainer={() => document.getElementById("TextDesign")}
            options={widthList()}
            defaultValue="normal"
          />
        </Form.Item>
      </Form>
    </ModuleTitle>
  );
};