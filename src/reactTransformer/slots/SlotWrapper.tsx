import React, { ReactNode } from "react";
import eventBus from "../eventBus";
import { StandardArrayItemType } from "../util/getFieldNames";
import { ContenxtMenuType } from "../contextMenu/index";
import componentList from "../util/constant";
import iconList, { getVueTypeName } from "../util/icon";

const componentMap = { ...componentList, ...iconList };

export type SlotWrapperProps = {
  path: string;
  widgetId: string;
  widgetProps: any;
  fieldNames?: StandardArrayItemType;
  children?: ReactNode;
  meta?: ContenxtMenuType[];
};

// import "./slotWrapper.less";

// 这里也存在两种情况，一种是可以拖拽替换，另外一种是编辑内部的文本，如何区分这两种情况, JSDoc???
// 暂时不考虑拖拽替换的情况

const SlotWrapper = (props: SlotWrapperProps) => {
  const handleBlur = (e: any) => {
    const value = e.target.innerHTML;
    // 通知 Model 更新props
    eventBus.emit("canvasEdit", props.path, value);
  };

  const handleMouseenter = (e: any) => {
    console.log(
      "handleMouseenter e = ",
      e,
      props.path,
      e.target.offsetHeight,
      e.target.offsetTop,
      e.target.offsetLeft
    );
    eventBus.emit(`${props.widgetId}:action`, {
      type: "show",
      path: props.path,
    });
  };
  const handleMouseleave = (e: any) => {
    eventBus.emit(`${props.widgetId}:action`, {
      type: "hide",
    });
  };
  const handleContextMenu = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    // 展示快捷菜单
    eventBus.emit("ContextMenu", "show", e, props);
  };

  const renderChildren = () => {
    const { children } = props;
    if (typeof children === "string") {
      return children;
    } else {
      const [componentName, componentProps] = children;
      const _name = getVueTypeName(componentName, "antd");
      return React.createElement(componentMap[_name], componentProps);
    }
  };

  return (
    <span
      className="slot-wrapper can-edit"
      // onMouseOver={handleMouseenter}
      // onMouseOut={handleMouseleave}
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
