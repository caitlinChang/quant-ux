import React from 'react';
import observer, { EventType } from "../../eventBus/Observer";
import "./index.less";

type PropsType = {
  children?: React.ReactNode;
};
export default (props: PropsType) => {
  console.log("props = ", props);
  const hasChildren = props?.children !== undefined;
  const handleClick = () => {
    observer.notify(EventType.FILL_WIDGET, {
      path: "children",
      id: "PageSection",
      formData: {},
    });
  };
  return (
    <div
      className={hasChildren ? "" : "Empty_Layout_Wrapper"}
      onClick={handleClick}
    >
      {hasChildren ? props?.children : "拖拽或点击选择组件"}
    </div>
  );
};