import React, { useEffect, useState } from "react";
import AntdMap from "../../../util/getWidgets/antd";
import AntdIconMap from "../../../util/getWidgets/icon";
import HTMLTags from "../../../util/getWidgets/html";
import { ComponentInfoType, ComponentWrapperType } from "../../../util/type";
import RenderedProps from "../../../util/getRenderedProps";

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
  console.log("reactWrapper path = ", path);
  const instance = new RenderedProps(props);
  const RenderComponent = getComponent(props.component, props.library);
  const [componentProps, setComponentProps] = useState<any>({});
  const { className, ...restProps } = componentProps;

  const getRenderedProps = async () => {
    const componentProps = await instance.get();
    setComponentProps(componentProps);
  };

  useEffect(() => {
    getRenderedProps();
  }, []);

  return (
    <>
      {typeof RenderComponent === "string" && RenderComponent}
      {typeof RenderComponent !== "string" && (
        <RenderComponent
          className={`${className} custom-widget-warpper`}
          {...restProps}
        />
      )}
    </>
  );
};
