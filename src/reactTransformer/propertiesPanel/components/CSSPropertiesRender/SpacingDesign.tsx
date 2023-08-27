import React, { useState } from "react";
import { Form, InputNumber, FormInstance } from "antd";
import ModuleTitle from "./ModuleTitle";
import PaddingPng from "./imgs/padding.png";
import PaddingItemPng from "./imgs/padding-item.png";
import { parseInt } from "lodash";

enum SpacingType {
  Margin = "margin",
  Padding = "padding",
}

enum SpacingListType {
  All = "All",
  TopAndBottom = "TopAndBottom",
  LeftAndRight = "LeftAndRight",
  Top = "Top",
  Bottom = "Bottom",
  Left = "Left",
  Right = "Right",
}

const typeList = {
  [SpacingListType.All]: [0, 1, 2, 3],
  [SpacingListType.TopAndBottom]: [0, 2],
  [SpacingListType.LeftAndRight]: [1, 3],
  [SpacingListType.Top]: [0],
  [SpacingListType.Bottom]: [2],
  [SpacingListType.Left]: [3],
  [SpacingListType.Right]: [1],
};

const spacingList = [
  {
    name: SpacingType.Margin,
    display: "margin(外边距)",
    value: typeList,
  },
  {
    name: SpacingType.Padding,
    display: "padding(内边距)",
    value: typeList,
  },
];

const list = [
  {
    label: "边距",
    value: SpacingListType.All,
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
    value: SpacingListType.TopAndBottom,
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
    value: SpacingListType.LeftAndRight,
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
    value: SpacingListType.Top,
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
    value: SpacingListType.Bottom,
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
    value: SpacingListType.Left,
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
    value: SpacingListType.Right,
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

function resolveSpacingStr(str) {
  const arr = (str || "").split(" ").map((i) => parseInt(i));
  if (arr.length === 1) {
    return [arr[0], arr[0], arr[0], arr[0]];
  } else if (arr.length === 2) {
    return [arr[0], arr[1], arr[0], arr[1]];
  } else if (arr.length === 3) {
    return [arr[0], arr[1], arr[2], 0];
  } else if (arr.length === 4) {
    return arr;
  }
  return [0, 0, 0, 0];
}

const SpacingItem = (props?: {
  value?: string;
  onChange?: (v?: string) => void;
}) => {
  const { value, onChange } = props;
  const _value = resolveSpacingStr(value);
  const [type, setType] = useState(SpacingListType.All);
  const onPXChange = (v) => {
    let newValue = [..._value];
    typeList[type].forEach((i) => {
      newValue[i] = v;
    });
    onChange?.(newValue.join("px ") + "px");
  };
  return (
    <div>
      <div className="spacing_icon-wrapper">
        {list.map((space) => {
          return (
            <span
              className={space.value === type ? "spacing_icon-selected" : ""}
              onClick={() => setType(space.value)}
            >
              {space.render()}
            </span>
          );
        })}
      </div>
      <InputNumber
        style={{ width: "180px" }}
        size="small"
        defaultValue={0}
        step={1}
        value={_value[typeList[type][0]]}
        onInput={onPXChange}
      />
    </div>
  );
};

export default (props: { form: FormInstance }) => {
  const [collapse, setCollapse] = useState();
  const handleToogleCollapse = (v) => {
    setCollapse(v);
    if (v) {
      props.form.setFieldsValue({
        padding: undefined,
        margin: undefined,
      });
    }
  };

  return (
    <ModuleTitle
      title="边距"
      collapse={collapse}
      onToggle={handleToogleCollapse}
    >
      {spacingList.map((item) => {
        return (
          <Form.Item label={item.display} name={item.name}>
            <SpacingItem />
          </Form.Item>
        );
      })}
    </ModuleTitle>
  );
};
