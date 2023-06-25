// 操作props的值的一些方法
import { set, unset } from "lodash";
export const deleteParam = (path: string, formData: any) => {
  if (!formData) {
    return;
  }
  const newData = JSON.parse(JSON.stringify(formData));
  unset(newData, path);
  return newData;
};
