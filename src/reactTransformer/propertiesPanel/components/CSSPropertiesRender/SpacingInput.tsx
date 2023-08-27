import React, { useEffect, useState } from "react";
import { Input, InputProps, Select, Tooltip } from "antd";
import { formatSize } from "../../../util/common";
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

{
  /* <Select
          defaultValue="px"
          value={type}
          onChange={handleSelectChange}
          options={list}
          getPopupContainer={() =>
            document.getElementById("Widget_Design_Panel")
          }
        /> */
}

export default (
  props?: InputProps & {
    value?: string;
    onChange?: (v?: string) => void;
  }
) => {
  const { value, onChange, ...restProps } = props;
  const [type, setType] = useState("px");
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const v = e.target.value;
    if (!v) {
      onChange?.(undefined);
      return;
    }
    if (type === "px") {
      onChange?.(v + "px");
    } else {
      onChange?.(v + "%");
    }
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
    <div>
      <Input
        value={formatSize(value)}
        addonAfter={"px"}
        allowClear
        onBlur={handleInputChange}
        {...restProps}
      />
    </div>
  );
};
