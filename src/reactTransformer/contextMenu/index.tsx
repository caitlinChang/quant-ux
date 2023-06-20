import React from "react";
import { List } from "antd";
import "./index.less";
import EventBus from "../eventBus";
import { set, get } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getCurKey } from "../propertiesPanel/util";

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
        _value.push({
          [props.originalProps.label]: "请编辑",
          [props.originalProps.value]: uuidv4().substr(0, 5),
        });
        break;
      case ContenxtMenuType.DELETE_ITEM:
      // _value =
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
