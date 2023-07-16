import { cloneDeep, isArray } from "lodash";
import { getVueTypeName } from "./constant";
import { formatPath } from "./common";

export enum ChildrenItemType {
  Text = "text",
  Component = "component",
}

export type ChildrenType = string | (string | [string, any])[];

/**
 *
 * @param children
 * @param rootWidgetProps
 * @returns 这个函数把存放在model中的widget数据中的 children 转化成画布能够识别渲染的结构
 * 返回的结构仍然是json，能够被递归组件 ChildrenWrapper 识别并渲染
 */
export function handleChildren(
  children: ChildrenType,
  rootWidgetProps: any,
  path
) {
  const _widgetProps = cloneDeep(rootWidgetProps || {});
  if (!isArray(children)) {
    return;
  }
  return children.map((item, index) => {
    if (typeof item === "string") {
      return {
        type: ChildrenItemType.Text,
        widgetProps: {
          ..._widgetProps,
          children: item,
          // path: `${formatPath(path)}children.${index}`,
        },
      };
    } else {
      const [name, props] = item;
      if (!name) {
        return;
      }
      return {
        type: ChildrenItemType.Component,
        componentInfo: {
          component: getVueTypeName(name, "antd"),
          props: { ...(props || {}) },
          // path: `${formatPath(path)}children.${index}`,
        },
      };
    }
  });
}
