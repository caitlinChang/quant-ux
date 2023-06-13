import React, { ReactNode } from "react";

const SlotWrapper = (props: { children: ReactNode }) => {
  return <div className="slot-wrapper can-edit">xxx{props.children}</div>;
};

export const setSlotWrapper = (children: ReactNode) => {
  return React.createElement(SlotWrapper, null, children);
};
