import React, { ReactNode } from "react";
import eventBus from "../../../eventBus";
import { StandardArrayItemType } from "../../../util/getFieldNames";
import antdList from "../../../util/getWidgets/antd";
import iconList from "../../../util/getWidgets/icon";
import { IconSlot } from "../IconSlot";
import { transferPath } from "../../../util/propsValueUtils";
import { isArray } from "lodash";
import "./index.less";

const componentMap = { ...antdList, ...iconList, IconSlot };

console.log("componentMap = ", componentMap);

export type SlotWrapperProps = {
  path: string;
  rootPath?: string; // 嵌套的子组件的props才会有这个属性
  rootWidgetId?: string; // 嵌套的子组件的props才会有这个属性
  widgetId: string;
  widgetProps: any;
  fieldNames?: StandardArrayItemType;
  children?: ReactNode;
  props?: SlotWrapperProps;
};

export const SlotWrapper = (props: SlotWrapperProps) => {
  const _props = props.props ? props.props : props;

  const handleBlur = (e: any) => {
    const _value = e.target.innerHTML;
    const { key, value, newFormData } = transferPath(
      _props.path,
      _value,
      _props.widgetProps
    );

    if (_props.rootPath && _props.rootWidgetId) {
      eventBus.emit(`canvasUpdate`, `${_props.rootPath}[1]`, newFormData);
      eventBus.emit(
        `${_props.rootWidgetId}:propsUpdate`,
        newFormData,
        `${_props.rootPath}[1]`
      );
      return;
    }
    eventBus.emit(`canvasUpdate`, key, value);
  };

  const renderChildren = () => {
    const { children } = _props;
    if (isArray(children)) {
      return (
        <>
          {children.map((childrenItem, index) => {
            const [componentName, componentProps] = childrenItem;
            if (!componentProps) {
              return (
                <span className="slot-wrapper can-edit" onBlur={handleBlur}>
                  {children}
                </span>
              );
            } else {
              const Component = componentMap[componentName];
              return <Component {...componentProps} />;
            }
          })}
        </>
      );
    }
  };
  return renderChildren();
};
