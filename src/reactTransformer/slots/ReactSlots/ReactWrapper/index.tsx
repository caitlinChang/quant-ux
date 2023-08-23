import React, { useEffect, useState, useMemo, createContext } from "react";
import AntdMap from "../../../util/getWidgets/antd";
import AntdIconMap from "../../../util/getWidgets/icon";
import HTMLTags from "../../../util/getWidgets/html";
import { ComponentInfoType, ComponentWrapperType } from "../../../util/type";
import RenderedProps from "../../../util/getRenderedProps";
import eventBus from "../../../eventBus";
import { transferPath } from "../../../util/propsValueUtils";
import { WidgetStore } from "../StoreWrapper/index";
import "./index.less";

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

  console.log("store ===== ", store);

  const handleClick = (e: any) => {
    console.log("触发点击事件");
  };
  const handleDblClick = (e: any) => {
    console.log("触发双击事件");
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

  useEffect(() => {
    getRenderedProps();
  }, []);

  useEffect(() => {
    if (id) {
      // 监听属性面板的更新
      eventBus.on(`${id}:propsUpdate`, async (props, path) => {
        // TODO: 待优化，不需要区分是否有 path
        if (path) {
          // 子组件的 inlineEdit
          const { newFormData } = transferPath(path, props, props.props);
          const componentProps = await instance.update(newFormData);
          setComponentProps(componentProps);
        } else {
          const newProps = { ...props.props, ...props };
          const componentProps = await instance.update(newProps);
          setComponentProps(componentProps);
        }
      });
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
