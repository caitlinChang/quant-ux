import { cloneDeep, get } from "lodash";
import { PropItemConfigType } from "../util/type";
import { formatPath } from "../util/common";
import { getFieldNames } from "../util/getFieldNames";
import { setSlotWrapper } from "./SlotWrapper";
import { handleChildren } from "../util/childrenUtils";
import { requestPropsConfig } from "../util/request";

export function getRenderedProps(
  componentName: string,
  props: any,
  rootWidgetId?: string,
  rootPath?: string
) {
  const res = requestPropsConfig(componentName);
  const propsConfig = res.props;
  if (!propsConfig || !props) {
    return;
  }
  const cloneProps = cloneDeep(props);
  return resolveWidgetProps(propsConfig, cloneProps, {
    rootWidgetId,
    rootPath,
  });
}

// 通过解析propsConfig，把存储的数据的props转化成真正的props
function resolveWidgetProps(
  propsConfig: PropItemConfigType,
  props: any,
  meta?: {
    fieldNames?: any;
    rootWidgetId?: string;
    rootPath?: string;
  }
) {
  const obj: any = {};
  let childirenList = [];
  Object.keys(props).map((propsName) => {
    const config = propsConfig[propsName];
    if (config) {
      obj[propsName] = getWrapperProps(config, propsName, props, meta);
    } else {
      obj[propsName] = props[propsName];
    }
  });
  const { children, ...restProps } = obj;
  if (!children) {
    childirenList = null;
  } else {
    childirenList = setChildrenList(children);
  }

  return {
    restProps: restProps,
    children: childirenList,
  };
}
/**
 * 解析children
 * @param childrenProps
 * @returns
 */
function setChildrenList(childrenProps): any[] {
  const { children, ...rest } = childrenProps;
  return handleChildren(children, rest);
}
/**
 * 处理不同类型的 propItem
 * @param config
 * @param path
 * @param rawProps
 * @param meta
 * @returns
 */
function getWrapperProps(
  config: any,
  path: string,
  rawProps: any,
  meta?: {
    fieldNames?: any;
    rootWidgetId?: string;
    rootPath?: string;
  }
) {
  const curValue = get(rawProps, path);
  const { name, property, item } = config.type || {};
  if (name === "ReactNode") {
    // children 需要特殊处理，用 slot 传递
    if (path === "children") {
      return {
        widgetId: meta.rootWidgetId,
        widgetProps: { ...rawProps },
        path: path,
        children: curValue,
        fieldNames: meta?.fieldNames,
      };
    }
    return setSlotWrapper({
      widgetId: meta.rootWidgetId,
      widgetProps: { ...rawProps },
      path: path,
      children: curValue,
      fieldNames: meta?.fieldNames as any,
      rootWidgetId: meta.rootWidgetId,
      rootPath: meta.rootPath, // 嵌套的子组件的路径
    });
  } else if (name === "object") {
    if (curValue) {
      const obj = {};
      Object.keys(curValue).forEach((key) => {
        const keyConfig = property[key];
        if (!keyConfig) {
          console.log(`${key}找不到对应的propsConfig`);
        } else {
          obj[key] = getWrapperProps(
            keyConfig,
            `${formatPath(path)}.${key}`,
            rawProps
          );
        }
      });
      return obj;
    }
    return curValue;
  } else if (name === "array") {
    if (curValue) {
      const fieldNames = getFieldNames(config);
      return curValue.map?.((_item, index) => {
        const obj = {};
        Object.keys(_item).forEach((key) => {
          const keyConfig = item[key];
          if (!keyConfig) {
            console.log(`【path=${path}】${key}找不到对应的props，请检查`);
            return;
          }
          if (key === "children" && keyConfig.type.name === "children") {
            obj[key] = getWrapperProps(
              { ...config, name: "children" },
              `${formatPath(path)}[${index}].${key}`,
              rawProps
            );
          } else {
            obj[key] = getWrapperProps(
              keyConfig,
              `${formatPath(path)}[${index}].${key}`,
              rawProps,
              { ...(meta || {}), fieldNames }
            );
          }
        });
        return obj;
      });
    }
    return curValue;
  } else {
    return curValue;
  }
}
