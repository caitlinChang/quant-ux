// 操作props的值的一些方法
import { set, unset, clone } from "lodash";
export const deleteParam = (path: string, formData: any) => {
  if (!formData) {
    return;
  }
  const newData = clone(formData);
  unset(newData, path);
  return newData;
};

export const setParam = (path: string, formData: any, value: any) => {
  if (!formData) {
    return;
  }
  const newData = clone(formData);
  set(newData, path, value);
  return newData;
};
