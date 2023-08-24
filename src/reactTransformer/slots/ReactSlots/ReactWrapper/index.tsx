import React, { useEffect, useState, useMemo, createContext } from "react";
import AntdMap from "../../../util/getWidgets/antd";
import AntdIconMap from "../../../util/getWidgets/icon";
import HTMLTags from "../../../util/getWidgets/html";
import { ComponentInfoType, ComponentWrapperType } from "../../../util/type";
import RenderedProps from "../../../util/getRenderedProps";
import { WidgetStore } from "../StoreWrapper/index";
import "./index.less";
import observer from "../../../eventBus/Observer";

const getComponent = (name, library: ComponentInfoType["library"]) => {
  let component = null;
  if (library === "antd") {
    component = AntdMap[name];
  } else if (library === "antdIcon") {
    component = AntdIconMap[name];
  }
  if (component) {
    return component;
  } else {
    // 匹配不上，就当成文本内容渲染
    // TODO： 后续加上匹配Html标签的规则
    return name;
  }
};

export default (props: ComponentWrapperType) => {
  const { id, path } = props;
  const instance = new RenderedProps(props);
  const RenderComponent = getComponent(props.component, props.library);
  const [componentProps, setComponentProps] = useState<any>({});
  const { className, onClick, onDblClick, ...restProps } = componentProps;
  const store = React.useContext(WidgetStore);

  const handleClick = (e: any) => {
    // e.stopPropagation();
    // if (props.path !== store.activePath) {
    //   store.resetActivePath();
    // }
  };
  const handleDblClick = (e: any) => {
    if (e.target.classList.contains("can-edit")) {
      return;
    }
    e.stopPropagation();
    store.handleSetActivePath(props);
  };

  const computedClassName = useMemo(() => {
    if (!path) {
      return "custom-widget-warpper";
    } else {
      if (store.activePath === path) {
        return "child-widget-warpper_active";
      } else {
        return "child-widget-warpper";
      }
    }
  }, [store.activePath, path]);

  const getRenderedProps = async () => {
    const componentProps = await instance.get();
    setComponentProps(componentProps);
  };

  const updateRenderedProps = async (newProps) => {
    console.log("画布侧接收到更新 = ", newProps);
    const componentProps = await instance.update(newProps);
    setComponentProps(componentProps);
  };

  useEffect(() => {
    getRenderedProps();
  }, []);

  useEffect(() => {
    if (id) {
      // 监听属性面板的更新
      console.log("设置属性面板监听器 = ", id, path);
      observer.subscribePropsUpdate(id, path, updateRenderedProps);
      return () => {
        observer.clearPropsUpdate();
      };
    }
  }, []);
  return (
    <>
      {typeof RenderComponent === "string" && RenderComponent}
      {typeof RenderComponent !== "string" && (
        <RenderComponent
          className={`${className} ${computedClassName}`}
          onClick={handleClick}
          onDoubleClick={handleDblClick}
          {...restProps}
        />
      )}
    </>
  );
};
