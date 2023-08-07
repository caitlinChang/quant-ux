import * as antdIcons from "@ant-design/icons";
import { revertName, getVueTypeName } from "./util";

const iconMap = {};

Object.keys(antdIcons).forEach((key) => {
  if (!antdIcons[key]) return;
  const module = antdIcons[key];
  // 双驼峰转中划线
  if (module.render && key !== "default") {
    iconMap[getVueTypeName(key, "antd")] = module;
  }
});

export const iconList = Object.keys(iconMap).map((key) => {
  return {
    _type: "antd4",
    w: 30,
    h: 30,
    name: key,
    displayName: revertName(key),
    category: "ICON",
    component: key,
    props: {},
  };
});
export default iconMap;
