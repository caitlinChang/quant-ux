import React from "react";
import eventBus from "../../../eventBus";
import { BorderInnerOutlined } from "@ant-design/icons";
// import "./slotWrapper.less";

// 进行替换操作时塞进去的占位符
export const IconSlot = (props: any) => {
  const handleClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    // 展示快捷菜单
    eventBus.emit("fillSlot", props);
  };
  return (
    <span className="icon-slot" onClick={handleClick}>
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
export const setIconSlot = (props: any) => {
  const { children, ...resProps } = props;
  return React.createElement(IconSlot, resProps, props.children);
};
