import * as antdIcons from "@ant-design/icons";
import { revertName, getVueTypeName } from "./constant";

const iconMap = {};
const nextComponent = ["Button", "Typography", "Radio", "Checkbox"];

Object.keys(antdIcons).forEach((key) => {
  if (!antdIcons[key]) return;
  const module = antdIcons[key];
  if (nextComponent.includes(key)) {
    Object.keys(module).forEach((item) => {
      if (!module[item]) return;
      // 判断 item 首个字符是否是大写字母
      if (/[A-Z]/.test(item[0])) {
        //FIXME:可能是 veura 插件没有兼容React.memo的场景,如果一个 reactElement 不包含 render，就不能正常渲染；
        if (module[item].render) {
          iconMap[getVueTypeName(`${key}${item}`, "antd")] = module[item];
        } else if (module[item].type?.render) {
          iconMap[getVueTypeName(`${key}${item}`, "antd")] = module[item].type;
        }
      }
    });
  }
  // 双驼峰转中划线
  iconMap[getVueTypeName(key, "antd")] = module;
});

export const iconList = Object.keys(iconMap).map((key) => {
  return {
    _type: "antd4",
    w: 30,
    h: 30,
    name: key,
    displayName: revertName(key),
    cagegory: "ICON",
    component: key,
    props: {},
  };
});
export default iconMap;
