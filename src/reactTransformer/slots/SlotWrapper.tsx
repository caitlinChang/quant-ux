import React, { ReactNode } from "react";

// 这里也存在两种情况，一种是可以拖拽替换，另外一种是编辑内部的文本，如何区分这两种情况, JSDoc???
// 暂时不考虑拖拽替换的情况
const SlotWrapper = (props: { children: ReactNode }) => {
  return <div className="slot-wrapper can-edit">xxx{props.children}</div>;
};

export const setSlotWrapper = (children: ReactNode) => {
  return React.createElement(SlotWrapper, null, children);
};
