import React, { useState, createContext, useEffect } from "react";
import { ComponentWrapperType } from "../../../util/type";

import observer, { EventType } from "../../../eventBus/Observer";

export const WidgetStore = createContext({});

export default (props?: { children?: any }) => {
  const [activePath, setActivePath] = useState(""); // 标记当前组件是否被选中

  const handleSetActivePath = (widget: ComponentWrapperType) => {
    const { path } = widget;
    setActivePath(path);
    observer.notify(EventType.SELECT_WIDGET, widget);
  };

  const resetActivePath = () => {
    setActivePath("");
    // observer.notify(EventType.SELECT_WIDGET, widget);
  };

  const onSelectWidget = (widget) => {
    setActivePath(widget.path);
  };

  const onDeSelectWidget = () => {
    setActivePath("");
  };

  useEffect(() => {
    observer.subscribe(EventType.SELECT_WIDGET, onSelectWidget);
    observer.subscribe(EventType.DE_SELECT_WIDGET, onDeSelectWidget);

    return () => {
      observer.clear();
    };
  }, []);
  const store = {
    activePath,
    handleSetActivePath,
  };
  return (
    <WidgetStore.Provider value={store}>{props?.children}</WidgetStore.Provider>
  );
};
