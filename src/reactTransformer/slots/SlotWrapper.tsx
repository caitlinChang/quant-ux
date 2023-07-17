import React, { ReactNode } from "react";
import eventBus from "../eventBus";
import { StandardArrayItemType } from "../util/getFieldNames";
import { ContenxtMenuType } from "../contextMenu/index";
import componentList, { getVueTypeName } from "../util/constant";
import iconList from "../util/icon";
import { IconSlot } from "../slots/IconSlot";
import { transferPath } from "../util/propsValueUtils";
import { isArray } from "lodash";

const componentMap = { ...componentList, ...iconList, IconSlot };

export type SlotWrapperProps = {
  path: string;
  rootPath?: string; // 嵌套的子组件的props才会有这个属性
  rootWidgetId?: string; // 嵌套的子组件的props才会有这个属性
  widgetId: string;
  widgetProps: any;
  fieldNames?: StandardArrayItemType;
  children?: ReactNode;
  meta?: ContenxtMenuType[];
  props?: SlotWrapperProps;
};

export const SlotWrapper = (props: SlotWrapperProps) => {
  const _props = props.props ? props.props : props;

  const handleBlur = (e: any) => {
    const _value = e.target.innerHTML;
    const { key, value, newFormData } = transferPath(
      _props.path,
      _value,
      _props.widgetProps
    );
    
    if (_props.rootPath && _props.rootWidgetId) {
      console.log('_props.rootWidgetId = ',_props.rootWidgetId , _props.rootPath)
      eventBus.emit(
        `canvasUpdate`,
        `${_props.rootPath}.1`,
        newFormData
      );
      return;
    }
    eventBus.emit(`canvasUpdate`, key, value);
  };

  // 展示快捷菜单
  const handleContextMenu = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const { meta, children } = props;
    if (typeof children === "string") {
      eventBus.emit("ContextMenu", "show", e, props);
    } else {
      eventBus.emit("ContextMenu", "show", e, {
        ...props,
        meta: [ContenxtMenuType.REPLACE_ICON, ContenxtMenuType.DELETE],
      });
    }
  };

  const renderChildren = () => {
    const { children } = _props;
    if (isArray(children)) {
      const [componentName, componentProps] = children;
      const _name =
        componentName === "IconSlot"
          ? "IconSlot"
          : getVueTypeName(componentName, "antd");
      return React.createElement(
        componentMap[_name],
        componentName === "IconSlot" ? _props : componentProps
      );
    } else {
      return children;
    }
  };
  return (
    <span className="slot-wrapper can-edit" onBlur={handleBlur}>
      {renderChildren()}
    </span>
  );
};
/**
 * 返回一个 React Element 对象，它是一个描述 React 元素的对象， React 根据
 * 这个对象来创建真实的Dom
 * @param children
 * @param path
 * @param id
 * @returns
 */
export const setSlotWrapper = (props: SlotWrapperProps) => {
  const { children, ...resProps } = props;
  if (typeof children === "string") {
    // 文本
    return React.createElement(SlotWrapper, resProps, children);
  } else if (isArray(children[0])) {
    // TODO: 处理多组件的情况
    return React.createElement(SlotWrapper, resProps, children[0]);
  } else {
    // TODO: 准备弃用
    return React.createElement(SlotWrapper, resProps, children);
  }
};

