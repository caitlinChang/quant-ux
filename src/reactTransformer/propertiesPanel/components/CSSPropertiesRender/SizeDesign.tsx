import React from 'react';
import { Form, Input } from 'antd';
import ModuleTitle from "./ModuleTitle";
const sizeConfig = [
  {
    label: "Width",
    value: "width",
  },
  {
    label: "MaxWidth",
    value: "maxWidth",
  },
  {
    label: "MinWidth",
    value: "minWidth",
  },
  {
    label: "Height",
    value: "Height",
  },
  {
    label: "MaxHeight",
    value: "maxHeight",
  },
  {
    label: "MinHeight",
    value: "minHeight",
  },
];
export default (props?: { value?: any; onChange?: (v: any) => void }) => {
  const [form] = Form.useForm();
  const handleChange = (v, allValues) => {
    const value = {};
    Object.keys(allValues).forEach((key) => {
      if (allValues[key] !== "auto") {
        value[key] = allValues[key];
      }
    });
    if (Object.keys(value).length === 0) {
      props.onChange?.(undefined);
    } else {
      props.onChange?.(value);
    }
  };
  return (
    <ModuleTitle title="宽高" collapse={true}>
      <Form
        form={form}
        labelCol={{ span: 9 }}
        colon={false}
        labelAlign="left"
        onValuesChange={handleChange}
        size="small"
      >
        {sizeConfig.map((item) => {
          return (
            <Form.Item label={item.label} name={item.value}>
              <Input defaultValue="auto" suffix="px" />
            </Form.Item>
          );
        })}
      </Form>
    </ModuleTitle>
  );
};