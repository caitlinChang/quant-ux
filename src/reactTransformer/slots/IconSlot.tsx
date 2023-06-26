import React from "react";
import { SlotWrapperProps } from "./SlotWrapper";
import eventBus from "../eventBus";
import "./slotWrapper.less";
import { BorderInnerOutlined } from "@ant-design/icons";

// 进行替换操作时塞进去的占位符
export const IconSlot = (props: SlotWrapperProps) => {
  const handleContextMenu = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    // 展示快捷菜单
    eventBus.emit("ContextMenu", "show", e, {
      ...props,
      meta: [...props.meta, 5],
    });
  };
  const handleClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    // 展示快捷菜单
    eventBus.emit("fillSlot", props);
  };
  return (
    <span
      className="icon-slot"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <BorderInnerOutlined style={{ fontSize: "20px", color: "#888" }} />
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
export const setIconSlot = (props: SlotWrapperProps) => {
  const { children, ...resProps } = props;
  return React.createElement(IconSlot, resProps, props.children);
};
