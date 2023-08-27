import { PropItemConfigType } from "./type";
import { isEmpty } from "lodash";

export const formatPath = (path) => {
  if (path) {
    return `${path}.`;
  } else {
    return "";
  }
};

// size 有可能是 undefined | xx px, 不处理百分比的情况
export const formatSize = (size) => {
  if (!size) {
    return undefined;
  } else if (size.includes("%")) {
    return size.replace("%", "");
  } else if (size.includes("px")) {
    return size.replace("px", "");
  }
};

/**
 * obj 单层的对象
 * @param obj
 */
export const getValidValue = (obj: any) => {
  if (!obj) {
    return undefined;
  }
  if (isEmpty(obj)) {
    return undefined;
  }
  const _obj = {};
  let hasValidValue = false;
  for (let key in obj) {
    if (key) {
      hasValidValue = true;
      _obj[key] = obj[key];
    }
  }

  if (hasValidValue) {
    return _obj;
  }
};

// 从 propsConfig 中找到 受控组件的事件和状态字段
export const findControlledProps = (propsConfig: {
  [key: string]: PropItemConfigType;
}) => {
  const controlledProps: {
    value?: string;
    onChange?: string;
    valuePath?: string;
  } = {};
  Object.entries(propsConfig).forEach(([key, item]) => {
    if (item.controlledState) {
      controlledProps.value = key;
    }
    if (item.controlledEvent) {
      controlledProps.onChange = key;
      controlledProps.valuePath = item.valuePath;
    }
  });
  if (controlledProps.value && controlledProps.onChange) {
    return controlledProps;
  }
  return null;
};
