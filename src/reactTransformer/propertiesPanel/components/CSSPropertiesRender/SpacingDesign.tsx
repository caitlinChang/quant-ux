import React, { useState } from "react";
import { Form, Input, InputNumber, Typography } from "antd";
import ModuleTitle from "./ModuleTitle";
import PaddingPng from "./imgs/padding.png";
import PaddingItemPng from "./imgs/padding-item.png";

const paddingType = {
  name: "padding",
  TopAndBottom: "paddingTopAndBottom",
  LeftAndRight: "paddingLeftAndRight",
  Top: "paddingTop",
  Bottom: "paddingBottom",
  Left: "paddingLeft",
  Right: "paddingRight",
};

const marginType = {
  name: "margin",
  TopAndBottom: "marginTopAndBottom",
  LeftAndRight: "marginLeftAndRight",
  Top: "marginTop",
  Bottom: "marginBottom",
  Left: "marginLeft",
  Right: "marginRight",
};

// pading: 1px 2px 3px 4px;
export default (props?: { value?: any; onChange?: (v: any) => void }) => {
  const [paddingValues, setPaddingValues] = useState({
    paddingTop: "auto",
    paddingBottom: "auto",
    paddingLeft: "auto",
    paddingRight: "auto",
  });
  const [curPaddingType, setCurePaddingType] = useState(paddingType.name); // paddingType[paddingType.name
  const [curMarginType, setCureMarginType] = useState(marginType.name); // paddingType[paddingType.name
  const [marginValues, setMarginValues] = useState({
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  });
  const list = (type) => [
    {
      label: "边距",
      value: type.name,
      render: () => {
        return (
          <span className="spacing_icon" style={{ display: "flex" }}>
            <img src={PaddingPng} style={{ transform: "rotate(90deg)" }} />
          </span>
        );
      },
      style: {},
    },
    {
      label: "上下边距",
      value: type.TopAndBottom,
      render: () => (
        <span className="spacing_icon" style={{ flexDirection: "column" }}>
          <img
            src={PaddingItemPng}
            style={{
              transform: "rotate(0deg)",
              position: "relative",
              bottom: "5px",
            }}
          />
          <img
            src={PaddingItemPng}
            style={{
              transform: "rotate(180deg)",
              position: "relative",
              bottom: "10px",
            }}
          />
        </span>
      ),
      style: {},
    },
    {
      label: "左右边距",
      value: type.LeftAndRight,
      render: () => (
        <span className="spacing_icon" style={{}}>
          <img
            src={PaddingItemPng}
            style={{
              transform: "rotate(-90deg)",
              position: "relative",
              left: "-5px",
            }}
          />
          <img
            src={PaddingItemPng}
            style={{
              transform: "rotate(90deg)",
              position: "relative",
              left: "-10px",
            }}
          />
        </span>
      ),
      style: {},
    },
    {
      label: "上边距",
      value: type.Top,
      render: () => (
        <span className="spacing_icon" style={{}}>
          <img
            src={PaddingItemPng}
            style={{
              transform: "rotate(0deg)",
            }}
          />
        </span>
      ),
    },
    {
      label: "下边距",
      value: type.Bottom,
      render: () => (
        <span className="spacing_icon" style={{}}>
          <img
            src={PaddingItemPng}
            style={{
              transform: "rotate(90deg)",
            }}
          />
        </span>
      ),
    },
    {
      label: "左边距",
      value: type.Left,
      render: () => (
        <span className="spacing_icon" style={{}}>
          <img
            src={PaddingItemPng}
            style={{
              transform: "rotate(180deg)",
            }}
          />
        </span>
      ),
    },
    {
      label: "右边距",
      value: type.Right,
      render: () => (
        <span className="spacing_icon" style={{}}>
          <img
            src={PaddingItemPng}
            style={{
              transform: "rotate(270deg)",
            }}
          />
        </span>
      ),
    },
  ];
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
  const onPXChange = (type, v) => {
    if (type === "padding") {
      setPaddingValues({
        ...paddingValues,
        [curPaddingType]: v,
      });
    } else {
      setMarginValues({
        ...marginValues,
        [curMarginType]: v,
      });
    }
  };
  const handleSelect = (type, v) => {
    if (type === "padding") {
      setCurePaddingType(v);
    }
    console.log(type);
  };
  return (
    <ModuleTitle
      title="Spacing"
      collapse={true}
      //   onToggle={handleToogleCollapse}
    >
      <Form labelCol={{ span: 9 }} colon={false} labelAlign="left">
        <Form.Item label="padding(inner)">
          <div className="spacing_icon-wrapper">
            {list(paddingType).map((item) => {
              return (
                <span
                  className={
                    item.value === curPaddingType ? "spacing_icon-selected" : ""
                  }
                  onClick={() => handleSelect("padding", item.value)}
                >
                  {item.render()}
                </span>
              );
            })}
          </div>
          <InputNumber
            style={{ width: "180px" }}
            size="small"
            defaultValue={0}
            step={1}
            onInput={(v) => onPXChange("padding", v)}
          />
        </Form.Item>
        <Form.Item label={"margin(outer)"}>
          <div className="spacing_icon-wrapper">
            {list(marginType).map((item) => {
              return (
                <span
                  className={
                    item.value === curMarginType ? "spacing_icon-selected" : ""
                  }
                  onClick={() => handleSelect("margin", item.value)}
                >
                  {item.render()}
                </span>
              );
            })}
          </div>
          <InputNumber
            style={{ width: "180px" }}
            size="small"
            allowClear
            defaultValue={"auto"}
            step={1}
            onInput={(v) => onPXChange("margin", v)}
          />
        </Form.Item>
      </Form>
    </ModuleTitle>
  );
};
