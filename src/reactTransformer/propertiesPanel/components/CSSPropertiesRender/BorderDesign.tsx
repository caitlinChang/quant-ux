import { Select, Form } from "antd";
import React, { useState, useEffect } from "react";
import ColorDesign from "./ColorDesign";
import { BorderAttrlist, BorderStyleList } from "./config";
import "./index.less";
import ModuleTitle from "./ModuleTitle";

const widthList = () => {
  const list = [];
  for (let i = 0; i < 10; i++) {
    list.push({ label: `${i}px`, value: `${i}px` });
  }
  return list;
};

const BorderSelect = (props?: {
  value?: string;
  onChange?: (v: string) => void;
}) => {
  const handleChange = (v) => {
    console.log("v = ", v);
    props.onChange && props.onChange(v);
  };
  return (
    <div className="icon_button-wrapper">
      {BorderAttrlist.map((item, index) => {
        return (
          <span
            key="index"
            className={
              props?.value === item.value
                ? "icon_button-selected border_icon"
                : "border_icon"
            }
            style={item.style}
            onClick={() => handleChange(item.value)}
          >
            <img src={item.label} alt="" />
          </span>
        );
      })}
    </div>
  );
};

const BorderStyleSelect = (props?: {
  value?: string;
  onChange?: (v: string) => void;
  defaultValue?: string;
}) => {
  const handleChange = (v) => {
    props?.onChange?.(v);
  };
  return (
    <div className="border_style_icon-wrapper">
      {BorderStyleList.map((item, index) => {
        return (
          <span
            key="index"
            className={
              props?.value === item.value
                ? "icon_button-selected border_style_icon"
                : "border_style_icon"
            }
            onClick={() => handleChange(item.value)}
          >
            <img src={item.label} alt="" />
          </span>
        );
      })}
    </div>
  );
};

const resolveBorderValue = (value: ValueType) => {
  if (!value)
    return {
      // 边框的默认值
      border: { width: "0px", style: "none", color: "#000" },
    };
  const { border, ...rest } = value;
  if (border) {
    const [width, style, color] = border.split(" ");
    return {
      border: {
        width,
        style,
        color,
      },
    };
  } else {
    const obj = {};
    Object.keys(rest).forEach((i) => {
      const [width, style, color] = rest[i].split(" ");
      obj[i] = {
        width,
        style,
        color,
      };
    });
    return obj;
  }
};

type BorderItemType = {
  width: string;
  style: "none" | "solid" | "dashed" | "groove";
  color: string;
};

type BorderValueType = {
  border?: BorderItemType;
  borderTop?: BorderItemType;
  borderRight?: BorderItemType;
  borderBottom?: BorderItemType;
  borderLeft?: BorderItemType;
};

type ValueType = {
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
};

export default (props?: {
  value?: ValueType;
  onChange?: (v: ValueType) => void;
}) => {
  const [collapse, setCollapse] = useState();
  const [curBorderType, setCurBorderType] = useState("border");
  const [borderValues, setBorderValues] = useState<BorderValueType>();
  const [form] = Form.useForm();
  useEffect(() => {
    const value = resolveBorderValue(props.value);
    setBorderValues(value);
    setCurBorderType(Object.keys(value)[0]);
    form.setFieldsValue(value[Object.keys(value)[0]]);
  }, [props.value]);

  const onClear = () => {
    props?.onChange?.(undefined);
  };

  const handleToogleCollapse = (v) => {
    setCollapse(v);
    if (v) {
      onClear();
    }
  };
  const handleChangeBorderType = (v) => {
    setCurBorderType(v);
    form.setFieldsValue(
      borderValues[v] || { width: "0px", style: "none", color: "#000" }
    );
  };

  const onChange = (borderValues) => {
    const value = Object.keys(borderValues).reduce((acc, cur) => {
      const { width, style, color } = borderValues[cur];
      acc[cur] = `${width} ${style} ${color}`;
      return acc;
    }, {});
    props?.onChange?.(value);
  };

  const handleChangeBorderValue = (_, v) => {
    if (curBorderType === "border") {
      const newValue = {
        border: v,
      };
      setBorderValues(newValue);
      onChange(newValue);
    } else {
      const newValue = {
        ...borderValues,
        [curBorderType]: v,
      };
      setBorderValues(newValue);
      onChange(newValue);
    }
  };
  return (
    <ModuleTitle
      title="边框"
      collapse={collapse}
      onToggle={handleToogleCollapse}
    >
      <div
        style={{ display: "flex" }}
        id="BorderDesign"
        className="design_module"
      >
        <BorderSelect value={curBorderType} onChange={handleChangeBorderType} />
        <Form
          form={form}
          size="small"
          colon={false}
          labelAlign="right"
          labelCol={{ span: 8 }}
          onValuesChange={handleChangeBorderValue}
        >
          <Form.Item
            style={{ margin: "8px", padding: 0 }}
            label="Width"
            name="width"
          >
            <Select
              getPopupContainer={() => document.getElementById("BorderDesign")}
              options={widthList()}
            ></Select>
          </Form.Item>
          <Form.Item
            style={{ margin: "8px", padding: 0 }}
            label="Style"
            name="style"
          >
            <BorderStyleSelect />
          </Form.Item>
          <Form.Item
            style={{ margin: "8px", padding: 0 }}
            label="Color"
            name="color"
          >
            <ColorDesign />
          </Form.Item>
        </Form>
      </div>
    </ModuleTitle>
  );
};
