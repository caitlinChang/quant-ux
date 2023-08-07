import React, { useState, ReactNode, useEffect } from "react";
import { Form } from "antd";
import ColorDesign from "./ColorDesign";
import ModuleTitle from "./ModuleTitle";

export default (props?: { value?: string; onChange?: (v: string) => void }) => {
  const [collapse, setCollapse] = useState();

  const onClear = () => {
    props?.onChange?.(undefined);
  };

  const handleToogleCollapse = (v) => {
    setCollapse(v);
    if (v) {
      onClear();
    }
  };

  const handleValuesChange = (v, allValues) => {
    props?.onChange?.(allValues);
  };

  return (
    <ModuleTitle
      title="背景色"
      onToggle={handleToogleCollapse}
      collapse={collapse}
    >
      <Form
        id="BackgroundDesign"
        size="small"
        labelAlign="left"
        labelCol={{ span: 9 }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          style={{ margin: "5px 0" }}
          label="Color"
          name="backgroundColor"
        >
          <ColorDesign />
        </Form.Item>
      </Form>
    </ModuleTitle>
  );
};
