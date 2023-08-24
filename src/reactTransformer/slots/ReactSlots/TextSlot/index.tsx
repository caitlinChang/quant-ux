import React from "react";
import observer from "../../../eventBus/Observer";
import { WidgetStore } from "../StoreWrapper/index";
import "./index.less";

export default (props: {
  id: string;
  path?: string;
  rawProps: any;
  value: string;
}) => {
  const store = React.useContext(WidgetStore);
  const handleBlur = (e: any) => {
    const value = e.target.innerHTML;
    observer.notifyPropsUpdate(props.id, props.path, value);
  };

  const handleDblClick = (e: any) => {
    store.handleSetActivePath({ ...props, component: "text" });
  };

  return (
    <span
      className="slot-wrapper can-edit"
      onDoubleClick={handleDblClick}
      onBlur={handleBlur}
    >
      {props.value}
    </span>
  );
};
