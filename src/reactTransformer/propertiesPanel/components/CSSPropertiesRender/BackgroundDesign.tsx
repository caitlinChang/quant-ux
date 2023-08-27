import React, { useState, ReactNode, useEffect } from "react";
import { Form } from "antd";
import ColorDesign from "./ColorDesign";
import ModuleTitle from "./ModuleTitle";
import { getValidValue } from "../../../util/common";
import { get } from "lodash";

export default (props?: { value?: any; onChange?: (v: any) => void }) => {
  const [collapse, setCollapse] = useState();

  const onClear = () => {
    props?.onChange?.(undefined);
  };

  const handleToogleCollapse = (v) => {
    setCollapse(v);
    if (!v && getValidValue(props.value)) {
      onClear();
    }
  };

  const handleValuesChange = (v, allValues) => {
    console.log(getValidValue(props?.value), getValidValue(allValues));
    if (!getValidValue(props?.value) && !getValidValue(allValues)) {
      return;
    }
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
