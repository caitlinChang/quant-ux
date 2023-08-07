import React, { useState } from "react";
import { Collapse, Form, Input, Radio } from "antd";
import ModuleTitle from "./ModuleTitle";
import "./index.less";

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
export default (props?: { value?: any; onChange?: (v: any) => void }) => {
  const [form] = Form.useForm();
  const [collapse, setCollapse] = useState(false);
  const handleChange = (v, allValues) => {
    const value = {};
    console.log("allValues = ", allValues);
    Object.keys(allValues).forEach((key) => {
      if (allValues[key] && allValues[key] !== "auto") {
        value[key] = `${allValues[key]}px`;
      }
    });
    if (Object.keys(value).length === 0) {
      props.onChange?.(undefined);
    } else {
      props.onChange?.(value);
    }
  };

  const onClear = () => {
    props.onChange?.(undefined);
    form.resetFields();
  };
  const handleToogleCollapse = (v) => {
    setCollapse(v);
    if (v) {
      onClear();
    }
  };
  return (
    <ModuleTitle
      title="宽高"
      collapse={collapse}
      onToggle={handleToogleCollapse}
    >
      <Form
        form={form}
        labelCol={{ span: 9 }}
        colon={false}
        labelAlign="left"
        onValuesChange={handleChange}
        size="small"
      >
        <Form.Item style={{ margin: "5px 0" }} label="Width" name="width">
          <Input defaultValue="auto" suffix="px" />
        </Form.Item>
        <Collapse className="size_collapse" ghost>
          <Collapse.Panel key={[1]}>
            {widthConfig.map((item) => {
              return (
                <Form.Item
                  style={{ margin: "5px 0" }}
                  label={item.label}
                  name={item.value}
                >
                  <Input defaultValue="auto" suffix="px" />
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
          <Input defaultValue="auto" suffix="px" />
        </Form.Item>
        <Collapse className="size_collapse" ghost>
          <Collapse.Panel key={[1]}>
            {heightConfig.map((item) => {
              return (
                <Form.Item
                  style={{ margin: "5px 0" }}
                  label={item.label}
                  name={item.value}
                >
                  <Input defaultValue="auto" suffix="px" />
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
      </Form>
    </ModuleTitle>
  );
};
