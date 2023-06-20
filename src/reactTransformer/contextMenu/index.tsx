import React from "react";
import { List } from "antd";
import "./index.less";
import EventBus from "../eventBus";
import { set, get } from "lodash";

enum ContenxtMenuType {
  ADD_SAME_LEVEL_ITEM = "add same level item",
  ADD_SUB_ITEM = "add sub item",
  DELETE_ITEM = "delete item",
  COPY_ITEM = "copy item",
  SMART_FILL = "smart fill",
}

const menu = [
  "add same level item",
  "add sub item",
  "delete item",
  "copy item",
  "智能填充",
];

type PropsType = {
  path: string;
  value: "";
  originalProps: any;
  hasChildren?: boolean;
};

export default (props: PropsType) => {
  const handleClickMenu = (e: any) => {
    const key = props.path;
    let _value: string | any[] = props.value;
    let children = [];
    switch (e.target.innerHTML) {
      case ContenxtMenuType.ADD_SAME_LEVEL_ITEM:
        _value = "";
        break;
      case ContenxtMenuType.ADD_SUB_ITEM:
        children = get(props.originalProps, props.path) as any;
        _value = children && Array.isArray(children) ? children : [];
        _value.push({});
        break;
      case ContenxtMenuType.DELETE_ITEM:
      case ContenxtMenuType.COPY_ITEM:
      case ContenxtMenuType.SMART_FILL:
      default:
        break;
    }
    const newValue = set(props.originalProps, props.path, _value);
    EventBus.emit("canvasEdit", key, newValue);
  };

  return (
    <List
      size="small"
      className="widget-item_context-menu"
      bordered
      dataSource={menu}
      renderItem={(item) => <div onClick={handleClickMenu}>{item}</div>}
    />
  );
};
