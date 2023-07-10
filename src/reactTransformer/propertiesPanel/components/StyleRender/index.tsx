import React, { ReactNode, useState, useEffect } from "react";
import { Radio, Input, Button, Tooltip } from "antd";
import { isArray } from "lodash";
import { PropItemConfigType } from "../../../util/type";
import { CloseCircleFilled } from "@ant-design/icons";
export type ValueType = string | [string, any];

const config = {
  width: "",
  height: "",
  padding: "",
  margin: "",
  border: "",
};

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

  const handleChangeProp = (value?: ValueType) => {
    props.onChange?.(value);
  };
  const handleChangeType = (v) => {
    setType(v.target.value);
  };
  return <div></div>;
};
