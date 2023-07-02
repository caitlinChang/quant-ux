import React, { ReactNode, useState, useEffect } from "react";
import { Radio, Input, Button } from "antd";
import { isArray } from "lodash";
import { PropItemConfigType } from "../../../util/type";
export type ValueType = string | [string, any];

export default (props: {
  node: {
    title: ReactNode;
    key: string;
    config: PropItemConfigType;
  };
  value?: ValueType;
  onChange?: (value: ValueType) => void;
  onSelectComponent?: () => void;
}) => {
  const [type, setType] = useState<"text" | "component">("text");
  const { node, value } = props;

  useEffect(() => {
    if (isArray(props.value)) {
      setType("component");
    }
  }, [props.value]);

  const handleChangeProp = (value) => {
    props.onChange?.(value);
  };
  const handleChangeType = (v) => {
    setType(v.target.value);
  };
  return (
    <div>
      <Radio.Group value={type} onChange={handleChangeType}>
        <Radio value="text">输入文本</Radio>
        <Radio value="component">选择组件</Radio>
      </Radio.Group>
      {type === "text" && (
        <Input
          defaultValue={value}
          onBlur={(e) => handleChangeProp(e.target.value)}
        />
      )}
      {type === "component" && (
        <div>
          <div>当前选中组件：{value[0]}</div>
          <Button onClick={props.onSelectComponent}>点击选择组件</Button>
        </div>
      )}
    </div>
  );
};
