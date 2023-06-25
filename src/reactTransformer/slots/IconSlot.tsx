import React from "react";
import { SlotWrapperProps } from "./SlotWrapper";
import eventBus from "../eventBus";

// ICON 的占位符
const ICONSlot = (props: SlotWrapperProps) => {
  const handleContextMenu = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    // 展示快捷菜单
    eventBus.emit("ContextMenu", "show", e, {
      ...props,
      meta: [...props.meta, 5],
    });
  };
  return (
    <span className="icon-slot-wrapper" onContextMenu={handleContextMenu}>
      {props.children}
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
export const setIconSlotWrapper = (props: SlotWrapperProps) => {
  const { children, ...resProps } = props;
  return React.createElement(ICONSlot, resProps, props.children);
};
