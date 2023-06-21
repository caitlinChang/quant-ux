import React from "react";
import { List } from "antd";
import "./index.less";
import EventBus from "../eventBus";
import { get } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getRecentPath } from "../util/propsValueUtils";
import { SlotWrapperProps } from "../slots/SlotWrapper";

enum ContenxtMenuType {
  ADD_SAME_LEVEL_ITEM = "add same level item",
  ADD_SUB_ITEM = "add sub item",
  DELETE_ITEM = "delete item",
  COPY_ITEM = "copy item",
  SMART_FILL = "smart fill",
}

const menu: { label: string; value: ContenxtMenuType }[] = [
  {
    label: "添加同级",
    value: ContenxtMenuType.ADD_SAME_LEVEL_ITEM,
  },
  {
    label: "添加子级",
    value: ContenxtMenuType.ADD_SUB_ITEM,
  },
  {
    label: "删除",
    value: ContenxtMenuType.DELETE_ITEM,
  },
  {
    label: "复制",
    value: ContenxtMenuType.COPY_ITEM,
  },
  {
    label: "智能填充",
    value: ContenxtMenuType.SMART_FILL,
  },
];

export type PropsType = SlotWrapperProps & {
  hasChildren?: boolean;
};

const getAddItem = (props: PropsType) => {
  // 获取fieldNames
  const { fieldNames } = props;
  if (!fieldNames) {
    console.log("获取不到标准的fieldNames，请检查");
  } else {
    return {
      [fieldNames.label]: "请编辑",
      [fieldNames.value]: uuidv4().substr(0, 5),
    };
  }
};

export default (props: PropsType) => {
  const addItem = getAddItem(props.widgetProps);

  const filteredMenu = menu;

  const handleClickMenu = (item: {
    label: string;
    value: ContenxtMenuType;
  }) => {
    const { index, keyPath } = getRecentPath(props.path);
    let _value: any = get(props.widgetProps, keyPath);
    let children = [];
    let transfer = null;
    if (index === null || !Array.isArray(_value)) {
      return;
    }

    switch (item.value) {
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
      dataSource={filteredMenu}
      renderItem={(item) => (
        <div
          className="widget-item_context-menu-item"
          onClick={() => handleClickMenu(item)}
        >
          {item.label}
        </div>
      )}
    />
  );
};
