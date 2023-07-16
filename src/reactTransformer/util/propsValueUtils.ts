import { getExactType } from "../util/common";
import { get, set, clone, cloneDeep } from "lodash";

// 该文件中是一些对 props 值的处理方法

/**
 * 获取组件中具体某个属性的类型，用于props中第一层的属性
 * @param {*} propsNamePath
 * @param {*} componentName
 */
export const getPropType = (propsName, propsConfig) => {
  const typeName = get(propsConfig, `${propsName}.type.name`);
  const properties = get(propsConfig, `${propsName}.type`);
  if (!typeName) {
    return null;
  }
  const [type, list] = getExactType(typeName);
  return {
    type,
    properties,
  };
};
/**
 * 获取组件中具体某个属性的类型，用于props中非第一层的属性
 * @param {*} propsNamePath
 * @param {*} componentName
 * @returns
 */
// export const getNestedPropType = (type, properties) => {
//   if (type === "array") {
//     // 返回 item 中是 ReactNode类型的 key
//     if (properties.item && Object.keys(properties.item).length) {
//       const itemList = Object.keys(properties.item);
//       const reactNodeItemList = itemList.filter((i) => {
//         return i.type.name === "ReactNode";
//       });
//       return reactNodeItemList;
//     }
//   } else if (type === "object") {
//     // 返回 item 中是 ReactNode类型的 key
//   } else {
//     // 暂不处理
//   }
// };
/**
 * 根据路径解析出第一个key, 用于把变化的值通知给 props
 * eg. a.b[0].c.name => a
 * @param {string} path
 */
export const getFirstKey = (path) => {
  const regex = /(\w+)|(\d+)/g;
  const matches = path.match(regex);
  return matches[0];
};

export const transferPath = (path: string, value: any, formData: any) => {
  const key = getFirstKey(path);
  const newFormData = set(cloneDeep(formData), path, value);
  return {
    key,
    value: newFormData[key],
    newFormData,
  };
}; 

/**
 * 方便 contentMenu 操作时对嵌套的，深层级的属性进行处理
 * eg. a.b[0].c.name => { index: 0, keyPath:a.b }
 * eg. a.b[0].c[1].label => {index:1, keyPath: a.b[0].c }
 * eg. a.b.c => {index: null, keyPath: a.b.c }
 * @param {string} path
 */
export const getRecentPath = (path) => {
  const pathParts = path.split(".");
  let index = null;
  let keyPath = "";

  for (let i = pathParts.length - 1; i >= 0; i--) {
    const part = pathParts[i];
    if (/\[\d+\]$/.test(part)) {
      // 检查是否是以 [数字] 结尾的数组索引表示
      index = parseInt(part.match(/\d+/)[0]); // 提取数组索引
      const arr = path.split(`[${index}]`); // 提取索引之前的键
      arr.pop(); // 去掉最后一个空字符串
      keyPath = arr.join(".");
      break;
    }
  }

  return {
    index,
    keyPath,
  };
};
