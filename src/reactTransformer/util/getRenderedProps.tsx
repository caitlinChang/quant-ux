// for react wrapper
import React from "react";
import { cloneDeep, get } from "lodash";
import { ComponentWrapperType, PropItemConfigType, TypeName } from "./type";
import { getFieldNames } from "./getFieldNames";
import ReactWrapper from "../slots/ReactSlots/ReactWrapper";
import TextSlot from "../slots/ReactSlots/TextSlot";
import { requestPropsConfig } from "./request";
import { handleChildren } from "./childrenUtils";

/**
 * 用于处理 ReactNode 的嵌套结构获取属性的path
 * @param path
 */
export const getNodePath = (rootPath: string, relativePath: string) => {
  if (rootPath) {
    return `${rootPath}[1].${relativePath}`;
  } else {
    return relativePath;
  }
};

// 获取可渲染的 props, 在数据库中存的props 都是json，这里要把json中的值转成 reactNode，以及文本内容要包加上 slot 用于编辑
/**
 * @widgetId: 根组件的id
 * @rootPath: 相对于根组件的路径
 */
class RenderedProps {
  rawComponentInfo: ComponentWrapperType;
  componentName: string;
  rawProps: any;
  widgetId: string | undefined;
  rootPath: string | undefined;
  propsConfig: PropItemConfigType;
  constructor(params: ComponentWrapperType) {
    const { component, props, path, id } = params;
    this.rawComponentInfo = cloneDeep(params);
    this.componentName = component;
    this.rawProps = cloneDeep(props);
    this.widgetId = id;
    this.rootPath = path || "";
    this.propsConfig = cloneDeep(this._getPropsConfig());
  }

  async get() {
    if (!this.propsConfig || !this.rawProps) {
      return {};
    }

    return this._recursionProps(this.propsConfig, this.rawProps);
  }

  async update(props) {
    this.rawProps = cloneDeep(props);
    if (!this.propsConfig || !this.rawProps) {
      return {};
    }

    return this._recursionProps(this.propsConfig, this.rawProps);
  }

  _getPropsConfig() {
    const res = requestPropsConfig(this.componentName);
    return res.props;
  }

  _recursionProps(propsConfig: PropItemConfigType, props: any) {
    const obj: any = {};

    Object.keys(props).map((propsName: string) => {
      const config = propsConfig[propsName];
      if (config) {
        obj[propsName] = this._getWrapperProps(config, `${propsName}`);
      } else {
        //  应该不存在这种情况
        console.error(
          `${propsName} 在 propsConfig中不存在, 请检查组件${this.componentName}`
        );
        obj[propsName] = props[propsName];
      }
    });
    return obj;
  }
  /**
   * 遍历每个 props，获取它 的 config 类型，即 TypeName，来决定如何处理
   * 基本规则是
   * 1. 如果是 ReactNode / ReactChild，则嵌套一层 ReactWrapper 然后返回
   * 2. 如果是 Object，递归调用 _getWrapperProps
   * 3. 如果是 Array，递归调用 _getWrapperProps
   * 4. 其他类型，直接返回
   * @param config
   * @param path
   * @returns
   */
  _getWrapperProps(config: any, path: string) {
    const curValue = get(this.rawProps, path);
    const { name, property, item } = config.type || {};

    if ([TypeName.ReactNode, TypeName.ReactChild].includes(name)) {
      /** 1. ReactNode, ReactChild 的情况 */
      const children = handleChildren(curValue, this.rawComponentInfo);
      console.log("getRenderedProps children = ", children);
      return (
        <>
          {children.map((item, index) => {
            const { type, widgetProps, componentInfo } = item;
            const relativePath = `${path}[${index}]`;
            console.log("relativePath = ", relativePath, widgetProps);
            if (type === "text") {
              const textRelativePath = `${relativePath}[0]`;
              return (
                <TextSlot
                  id={this.widgetId}
                  value={get(widgetProps.props, relativePath)}
                  path={getNodePath(this.rootPath, textRelativePath)}
                />
              );
            } else {
              return (
                <ReactWrapper
                  component={componentInfo.component}
                  library={this.rawComponentInfo.library}
                  props={componentInfo.props}
                  id={this.widgetId}
                  path={getNodePath(this.rootPath, relativePath)}
                />
              );
            }
          })}
        </>
      );
    } else if (name === TypeName.Object) {
      /** 2. Object 的情况 */
      if (curValue) {
        const obj = {};
        Object.keys(curValue).forEach((key) => {
          const keyConfig = property[key];
          if (!keyConfig) {
            console.log(`${key}找不到对应的propsConfig`);
          } else {
            obj[key] = this._getWrapperProps(keyConfig, `${path}.${key}`);
          }
        });
        return obj;
      }
      return curValue;
    } else if (name === TypeName.Array) {
      /** 3. Array 的情况 */
      if (curValue) {
        // const fieldNames = getFieldNames(config);
        return curValue.map?.((_item, index) => {
          const obj = {};
          Object.keys(_item).forEach((key) => {
            const keyConfig = item[key];
            if (!keyConfig) {
              console.log(`【path=${path}】${key}找不到对应的props，请检查`);
              return;
            }
            if (key === "children" && keyConfig.type.name === "children") {
              obj[key] = this._getWrapperProps(
                { ...config, name: "children" },
                `${path}[${index}].${key}`
              );
            } else {
              obj[key] = this._getWrapperProps(
                keyConfig,
                `${path}[${index}].${key}`
              );
            }
          });
          return obj;
        });
      }
      return curValue;
    } else {
      /** 4. 其他情况直接返回value */
      return curValue;
    }
  }
}

export default RenderedProps;
