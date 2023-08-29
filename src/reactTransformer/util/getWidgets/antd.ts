import * as antdComponents from "antd";
import { getMockedProps } from "../mock";
import { requestPropsConfig } from "../request";
import { cloneDeep } from "lodash";

const getUniqueName = (name: string, prefix: string) => {
  return name;
};

const componentMap = {};
// 有子组件的组件，需要遍历一下
const nextComponent = [
  "Button",
  "Typography",
  "Descriptions",
  "Radio",
  "Checkbox",
  "Form",
  "Collapse",
  "Timeline",
];

const subComponent = []

Object.keys(antdComponents).forEach((key) => {
  if (!antdComponents[key]) return;
  const module = antdComponents[key];
  if (nextComponent.includes(key)) {
    Object.keys(module).forEach((item) => {
      if (!module[item]) return;
      // 通过判断 item 首个字符是否是大写字母来判断是否子组件的存在
      if (/[A-Z]/.test(item[0])) {
        //FIXME:可能是 veura 插件没有兼容React.memo的场景,如果一个 reactElement 不包含 render，就不能正常渲染；
        // if (module[item].render) {
        //   componentMap[getUniqueName(`${key}${item}`, "Antd")] = module[item];
        // } else if (module[item].type?.render) {
        //   componentMap[getUniqueName(`${key}${item}`, "Antd")] =
        //     module[item].type;
        // } else if (typeof module[item] === "function") {
        //   componentMap[getUniqueName(`${key}${item}`, "Antd")] = module[item];
        // }
        const name = `${key}-${item}`;
        componentMap[getUniqueName(name, "Antd")] = module[item];
        subComponent.push({
          key: getUniqueName(name, "Antd"),
          path: [key, item],
        });
      }
    });
  }
  // 双驼峰转中划线
  componentMap[getUniqueName(key, "Antd")] = module;
  subComponent.push({
    key: getUniqueName(key, "antd"),
    path: [key],
  });
});

// 在黑名单中的不会展示
const blackList = [
  "Affix",
  "Anchor",
  "Alert",
  "BackTop",
  "Avatar",
  "Breadcrumb",
  "Calendar",
  "Card",
  "Carousel",
  "ConfigProvider",
  "Drawer",
  "Empty",
  "Image",
  "Grid",
  "Layout",
  "List",
  "Mentions",
  "Popover",
  "Rate",
  "Result",
  "Row",
  "Col",
  "Skeleton",
  "Slider",
  "Spin",
  // 属于某项操作才能触发的
  "message",
  "notification",
  "version",
  "Form-List",
  "Form-ErrorList",
  "Form-Provider", // 无UI 状态管理组件，不展示
  "Typography", // 可以通过 Typography-Text 来展示
  "Typography-Link", //可以通过 Typography-Text 来展示
  "Typography-Paragraph", // 可以通过 Typography-Text 来展示
  "Button-Group",
  "Radio-Button", // 没有这个组件，无需展示
  "Descriptions-Item", // 这个组件展示有问题，暂不支持
  "Descriptions", // 这个组件展示有问题，暂不支持
];
export const antdList = Object.keys(componentMap)
  .filter((i) => !blackList.includes(i))
  .map((key) => {
    const res = requestPropsConfig(key);
    const props = getMockedProps(res?.props);

    const componentPath = subComponent.find((item) => item.key === key)?.path;
    return {
      _type: "antd4",
      w: 200,
      h: 60,
      name: key,
      description: res.description,
      displayName: res.displayName || key,
      category: "Ant Design",
      component: key,
      props: cloneDeep(props),
      componentPath,
      framework: "react",
      library: "antd",
    };
  });
  console.log("componentMap = ", componentMap, antdList);
export default componentMap;
