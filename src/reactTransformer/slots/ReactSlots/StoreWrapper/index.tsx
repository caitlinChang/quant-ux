import React, { useState, createContext, useEffect } from "react";
import eventBus from "../../../eventBus";
import { ComponentWrapperType } from "../../../util/type";

export const WidgetStore = createContext({});

export default (props?: { children?: any }) => {
  const [activePath, setActivePath] = useState(""); // 标记当前组件是否被选中
  const handleSetActivePath = (widget: ComponentWrapperType) => {
    const { path } = widget;
    setActivePath(path);
    eventBus.emit(`selectWidgetChild`, {
      ...widget,
    });
  };

  useEffect(() => {
    // 属性面板按照路径选择组件
    eventBus.on("reverseElectionChild", (child, path) => {
      eventBus.emit(`selectWidgetChild`, {
        ...props,
        path,
      });
    });
    // 取消选中时
    // TODO: id 是否可以去掉
    // eventBus.on(`${id}:deSelected`, () => {
    //   setActivePath("");
    // });
  }, []);
  const store = {
    activePath,
    handleSetActivePath,
  };
  return (
    <WidgetStore.Provider value={store}>{props?.children}</WidgetStore.Provider>
  );
};
