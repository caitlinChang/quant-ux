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
  const { item = {} } = propsConfig.type;

  const itemMap = Object.keys(item);
  if (!itemMap.length)
    return {
      label: _label,
      value: _value,
    };
  // 适用于 antd 组件的命名规则
  if (/ReactNode/.test(item.title?.type?.name)) {
    _label = "title";
  }
  if (/ReactNode/.test(item.label.type?.name)) {
    _label = "label";
  }

  if (/string/.test(item.value.type?.name)) {
    _value = "value";
  }
  if (/string/.test(item.key.type?.name)) {
    _value = "key";
  }
  if (/string/.test(item.dataIndex.type?.name)) {
    _value = "dataIndex";
  }
  const obj: StandardArrayItemType = {
    label: _label,
    value: _value,
  };

  if (itemMap.includes("disabled")) {
    obj.disabled = false;
  }
  if (itemMap.includes("icon")) {
    obj.icon = "icon";
  }
  return obj;
};
