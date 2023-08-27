import React, { useEffect, useState } from "react";
import { Input, InputProps, Select } from "antd";

const list = [
  {
    label: "%",
    value: "%",
  },
  {
    label: "px",
    value: "px",
  },
];

export default (
  props?: InputProps & {
    value?: string;
    onChange?: (v?: string) => void;
  }
) => {
  const { value, onChange, ...restProps } = props;
  const [type, setType] = useState("px");
  const [inputValue, setInputValue] = useState("");

  const resolveValue = (value) => {
    if (!value) {
      return;
    } else if (value.includes("%")) {
      const _value = value.replace("%", "");
      setInputValue(_value);
      setType("%");
      // return _value;
    } else if (value.includes("px")) {
      const _value = value.replace("px", "");
      setInputValue(_value);
      setType("px");
      // return _value;
    }
  };

  useEffect(() => {
    resolveValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    const v = e.target.value;
    if (type === "px") {
      onChange?.(v + "px");
    } else {
      onChange?.(v + "%");
    }
    setInputValue(v);
  };
  const handleSelectChange = (v) => {
    if (v === "px") {
      setType("px");
      onChange?.(undefined);
    } else {
      setType("%");
      onChange?.("100%");
    }
  };

  return (
    <Input
      value={inputValue}
      addonAfter={
        <Select
          defaultValue="px"
          value={type}
          onChange={handleSelectChange}
          options={list}
          getPopupContainer={() =>
            document.getElementById("Widget_Design_Panel")
          }
        />
      }
      onChange={handleInputChange}
      {...restProps}
    />
  );
};
