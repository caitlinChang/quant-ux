import * as antdIcons from "@ant-design/icons";
import { revertName, getVueTypeName } from "./util";
import { requestPropsConfig } from "../request";
import { getMockedProps } from "../mock";
import { cloneDeep } from "lodash";

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
  const res = requestPropsConfig("icon");
  const props = getMockedProps(res.props);
  return {
    _type: "antd4",
    w: 30,
    h: 30,
    name: key,
    displayName: revertName(key),
    category: "ICON",
    component: key,
    props: cloneDeep(props),
  };
});
export default iconMap;
