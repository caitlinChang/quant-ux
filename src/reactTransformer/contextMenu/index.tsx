import React from "react";
import { List } from "antd";
import "./index.less";
import EventBus from "../eventBus";
import { set, get } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getRecentPath } from "../propertiesPanel/util";
import { SlotWrapperProps } from "../slots/SlotWrapper";

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

export type PropsType = SlotWrapperProps & {
  hasChildren?: boolean;
};

const getAddItem = (props: PropsType) => {
  // 获取fieldNames
  return {
    [props.label]: "请编辑",
    [props.value]: uuidv4().substr(0, 5),
  };
};

export default (props: PropsType) => {
  console.log("contentMenu内部 props = ", props);
  const addItem = getAddItem(props.widgetProps);

  const handleClickMenu = (e: any) => {
    const { index, keyPath } = getRecentPath(props.path);
    let _value: any = get(props.widgetProps, keyPath);
    let children = [];
    let transfer = null;
    console.log("index = ", index, "keyPath = ", keyPath, "_value = ", _value);
    if (index === null || !Array.isArray(_value)) {
      return;
    }

    switch (e.target.innerHTML) {
      case ContenxtMenuType.ADD_SAME_LEVEL_ITEM:
        _value.splice(index, 0, addItem);
        EventBus.emit("canvasEdit", keyPath, _value);
        break;
      case ContenxtMenuType.ADD_SUB_ITEM:
        children = _value[index].children || [];
        children.unshift(addItem);

        EventBus.emit(
          "canvasEdit",
          `${keyPath}[${index}].${children}`,
          children
        );
        break;
      case ContenxtMenuType.DELETE_ITEM:
        _value.splice(index, 1);
        EventBus.emit("canvasEdit", keyPath, _value);
        break;
      case ContenxtMenuType.COPY_ITEM:
        transfer = _value[index];
        _value.splice(index, 0, transfer);
        EventBus.emit("canvasEdit", keyPath, _value);
        break;
      case ContenxtMenuType.SMART_FILL:
        console.log("暂不支持此功能");
        break;
      default:
        break;
    }
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
