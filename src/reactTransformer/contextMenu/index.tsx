import React from "react";
import { List } from "antd";
import "./index.less";
import eventBus from "../eventBus";
import _, { get } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getRecentPath } from "../util/propsValueUtils";
import { SlotWrapperProps } from "../slots/SlotWrapper";
import { deleteParam, setParam } from "../util/setPropsValue";

export enum ContenxtMenuType {
  ADD_SAME_LEVEL_ITEM,
  ADD_SUB_ITEM,
  DELETE_ITEM, // 删除数据中的这一项
  COPY_ITEM,
  SMART_FILL,
  REPLACE_ICON,
  DELETE, // 删除这个字段，或者将这个字段的值置为null
  ADD_ICON,
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
  {
    label: "替换 ICON",
    value: ContenxtMenuType.REPLACE_ICON,
  },
  {
    label: "删除",
    value: ContenxtMenuType.DELETE,
  },
  {
    label: "添加 ICON",
    value: ContenxtMenuType.ADD_ICON,
  },
];

const onFilter = (menu, props) => {
  const { meta } = props;
  let newMenu = [...menu];
  newMenu = newMenu.filter((item) => meta.includes(item.value));
  // 如果只剩一个则不能再删除
  const { index, keyPath } = getRecentPath(props.path);
  const value = get(props.widgetProps, keyPath);
  if (index === 0 && value?.length === 1) {
    newMenu = newMenu.filter(
      (item) => item.value !== ContenxtMenuType.DELETE_ITEM
    );
  }
  return newMenu;
};

const getAddItem = (props: SlotWrapperProps) => {
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

export default (props: SlotWrapperProps) => {
  const addItem = getAddItem(props);
  const filteredMenu = onFilter(menu, props);

  const handleClickMenu = (
    e: any,
    item: {
      label: string;
      value: ContenxtMenuType;
    }
  ) => {
    e.stopPropagation();
    const { index, keyPath } = getRecentPath(props.path);

    let _value: any = get(props.widgetProps, keyPath);
    let children = [];
    let transfer = null;
    if (index === null || !Array.isArray(_value)) {
      return;
    }

    switch (item.value) {
      case ContenxtMenuType.ADD_SAME_LEVEL_ITEM:
        _value.splice(index + 1, 0, addItem);
        eventBus.emit("canvasEdit", keyPath, _value, true);
        break;
      case ContenxtMenuType.ADD_SUB_ITEM:
        children = _value[index].children || [];
        children.unshift(addItem);
        eventBus.emit(
          "canvasEdit",
          `${keyPath}[${index}].${children}`,
          children,
          true
        );
        break;
      case ContenxtMenuType.DELETE_ITEM:
        _value.splice(index, 1);
        eventBus.emit("canvasEdit", keyPath, _value, true);
        break;
      case ContenxtMenuType.COPY_ITEM:
        transfer = _value[index];
        _value.splice(index, 0, transfer);
        eventBus.emit("canvasEdit", keyPath, _value, true);
        break;
      case ContenxtMenuType.SMART_FILL:
        console.log("暂不支持此功能");
        break;
      case ContenxtMenuType.REPLACE_ICON:
        // 将原有ICON删除，替换成占位符
        transfer = setParam(props.path, props.widgetProps, [
          "IconSlot",
          { style: { fontSize: "16px" } },
        ]);
        eventBus.emit("canvasEdit", keyPath, transfer[keyPath], true);
        break;
      case ContenxtMenuType.DELETE:
        transfer = deleteParam(props.path, props.widgetProps);
        eventBus.emit("canvasEdit", keyPath, transfer[keyPath], true);
        break;
      case ContenxtMenuType.ADD_ICON:
        // 添加 ICON 占位符
        break;
      default:
        break;
    }

    eventBus.emit("ContextMenu", "close");
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
          onClick={(e) => handleClickMenu(e, item)}
        >
          {item.label}
        </div>
      )}
    />
  );
};
