import React, { ReactNode } from "react";
import eventBus from "../eventBus";
// import "./slotWrapper.less";
// 这里也存在两种情况，一种是可以拖拽替换，另外一种是编辑内部的文本，如何区分这两种情况, JSDoc???
// 暂时不考虑拖拽替换的情况
const SlotWrapper = (props: {
  path: string;
  id: string;
  children?: ReactNode;
}) => {
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
    eventBus.emit(`${props.id}:action`, {
      type: "show",
      path: props.path,
    });
  };
  const handleMouseleave = (e: any) => {
    eventBus.emit(`${props.id}:action`, {
      type: "hide",
    });
  };
  const handleContextMenu = (e: any) => {
    console.log("handleContextMenu e = ", e);
    // eventBus.emit(`${props.id}:contenxtMenu`, {
    //   type: "hide",
    // });
  };
  return (
    <div
      className="slot-wrapper can-edit"
      // onMouseOver={handleMouseenter}
      // onMouseOut={handleMouseleave}
      onContextMenu={handleContextMenu}
      onBlur={handleBlur}
    >
      {props.children}
    </div>
  );
};

export const setSlotWrapper = (
  children: ReactNode,
  path: string,
  id: string
) => {
  return React.createElement(
    SlotWrapper,
    {
      path,
      id,
    },
    children
  );
};
