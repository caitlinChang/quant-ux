import React, { useEffect } from "react";
import observer from "../../../eventBus/Observer";
import { WidgetStore } from "../StoreWrapper/index";
import { ComponentWrapperType } from "../../../util/type";
import { get, set } from "lodash";

import "./index.less";

export default (props: {
  path: string; // 相当于上次组件的路径
  value: string;
  id: string;
}) => {
  const store = React.useContext(WidgetStore);
  const { path, id } = props;
  const handleBlur = (e: any) => {
    const value = e.target.innerHTML;
    observer.notifyPropsUpdate(id, path, value);
  };

  const handleDblClick = (e: any) => {
    store.handleSetActivePath({ ...props, component: "text" });
  };

  useEffect(() => {
    observer.subscribePropsUpdate(id, path, (newProps: any) => {
      const value = get(newProps, path);
      if (value) {
        // e.target.innerHTML = value;
      }
    });
    return () => {
      observer.clearPropsUpdate();
    };
  }, []);

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
