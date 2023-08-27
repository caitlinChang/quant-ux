import React, { useState, useEffect } from "react";
import { Collapse, Form, FormInstance, Input, Radio, InputProps } from "antd";
import ModuleTitle from "./ModuleTitle";
import "./index.less";
import SpacingInput from "./SpacingInput";

const widthConfig = [
  {
    label: "MaxWidth",
    value: "maxWidth",
  },
  {
    label: "MinWidth",
    value: "minWidth",
  },
];

const heightConfig = [
  {
    label: "MaxHeight",
    value: "maxHeight",
  },
  {
    label: "MinHeight",
    value: "minHeight",
  },
];

const overflowConfig = [
  { label: "auto", value: "auto" },
  { label: "visible", value: "visible" },
  { label: "hidden", value: "hidden" },
  { label: "scorll", value: "scorll" },
];

export default (props?: { form: FormInstance }) => {
  const [collapse, setCollapse] = useState(false);

  const handleToogleCollapse = (v) => {
    setCollapse(v);
    if (!v) {
      props.form.resetFields([
        "width",
        "height",
        "maxWidth",
        "minWidth",
        "maxHeight",
        "minHeight",
      ]);
    }
  };
  return (
    <ModuleTitle
      title="宽高"
      collapse={collapse}
      onToggle={handleToogleCollapse}
    >
      <Form.Item style={{ margin: "5px 0" }} label="Width" name="width">
        <SpacingInput />
      </Form.Item>
      <Collapse className="size_collapse" ghost>
        <Collapse.Panel key={[1]}>
          {widthConfig.map((item) => {
            return (
              <Form.Item
                // @ts-ignore
                key={item.value}
                style={{ margin: "5px 0" }}
                label={item.label}
                name={item.value}
              >
                <SpacingInput defaultValue="auto" />
              </Form.Item>
            );
          })}
          <Form.Item
            style={{ margin: "5px 0" }}
            label="Overflow"
            name="overflowX"
          >
            <Radio.Group defaultValue="auto" options={overflowConfig} />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
      <Form.Item style={{ margin: "5px 0" }} label="Height" name="height">
        <SpacingInput defaultValue="auto" />
      </Form.Item>
      <Collapse className="size_collapse" ghost>
        <Collapse.Panel key={[1]}>
          {heightConfig.map((item) => {
            return (
              <Form.Item
                // @ts-ignore
                key={item.value}
                style={{ margin: "5px 0" }}
                label={item.label}
                name={item.value}
              >
                <SpacingInput defaultValue="auto" />
              </Form.Item>
            );
          })}
          <Form.Item
            style={{ margin: "5px 0" }}
            label="Overflow"
            name="overflowY"
          >
            <Radio.Group defaultValue="auto" options={overflowConfig} />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    </ModuleTitle>
  );
};
