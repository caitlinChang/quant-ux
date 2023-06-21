import { ReactNode } from "react";
import { PropItemConfigType } from "./type";
export type StandardArrayItemType = {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
  icon?: ReactNode;
};
/**
 * 获取匹配属性面板的自增组件的字段，一般来讲，需要 label 和 value
 * 类似于获取 fieldNames
 * @param {*} propsConfig
 * @returns
 */
export const getFieldNames = (propsConfig: PropItemConfigType) => {
  let _label = "label";
  let _value = "value";
  const itemMap = propsConfig.type?.item;
  if (!itemMap)
    return {
      label: _label,
      value: _value,
    };
  const keys = Object.keys(itemMap);
  if (!keys.length)
    return {
      label: _label,
      value: _value,
    };
  // 适用于 antd 组件的命名规则
  if (/ReactNode/.test(itemMap.title)) {
    _label = "title";
  }
  if (/ReactNode/.test(itemMap.label)) {
    _label = "label";
  }

  if (/string/.test(itemMap.value)) {
    _value = "value";
  }
  if (/string/.test(itemMap.key)) {
    _value = "key";
  }
  if (/string/.test(itemMap.dataIndex)) {
    _value = "dataIndex";
  }
  const obj: StandardArrayItemType = {
    label: _label,
    value: _value,
  };

  if (itemMap.disabled) {
    obj.disabled = false;
  }
  if (itemMap.icon) {
    obj.icon = "icon";
  }
  return obj;
};
