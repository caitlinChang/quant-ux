import React, { ReactNode } from "react";
import eventBus from "../eventBus";
import { StandardArrayItemType } from "../util/getFieldNames";
import { ContenxtMenuType } from "../contextMenu/index";
import componentList, { getVueTypeName } from "../util/constant";
import iconList from "../util/icon";
import { IconSlot } from "../slots/IconSlot";

const componentMap = { ...componentList, ...iconList, IconSlot };

export type SlotWrapperProps = {
  path: string;
  widgetId: string;
  widgetProps: any;
  fieldNames?: StandardArrayItemType;
  children?: ReactNode;
  meta?: ContenxtMenuType[];
};

const SlotWrapper = (props: SlotWrapperProps) => {
  const handleBlur = (e: any) => {
    const value = e.target.innerHTML;
    // 通知 Model 更新props
    eventBus.emit("canvasEdit", props.path, value);
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
    const { children } = props;
    if (typeof children === "string") {
      return children;
    } else {
      const [componentName, componentProps] = children;
      const _name =
        componentName === "IconSlot"
          ? "IconSlot"
          : getVueTypeName(componentName, "antd");
      return React.createElement(componentMap[_name], componentProps);
    }
  };

  return (
    <span
      className="slot-wrapper can-edit"
      onContextMenu={handleContextMenu}
      onBlur={handleBlur}
    >
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
  return React.createElement(SlotWrapper, resProps, props.children);
};
