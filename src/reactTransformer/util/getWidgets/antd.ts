import * as antdComponents from "antd";
import { getMockedProps } from "../mock";
import { requestComponentProps } from "../request";
import { getVueTypeName } from "./util";

const componentMap = {};
// 有子组件的组件，需要遍历一下
const nextComponent = ["Button", "Typography", "Radio", "Checkbox", "Form"];

Object.keys(antdComponents).forEach((key) => {
  if (!antdComponents[key]) return;
  const module = antdComponents[key];
  if (nextComponent.includes(key)) {
    Object.keys(module).forEach((item) => {
      if (!module[item]) return;
      // 判断 item 首个字符是否是大写字母
      if (/[A-Z]/.test(item[0])) {
        //FIXME:可能是 veura 插件没有兼容React.memo的场景,如果一个 reactElement 不包含 render，就不能正常渲染；
        if (module[item].render) {
          componentMap[getVueTypeName(`${key}${item}`, "antd")] = module[item];
        } else if (module[item].type?.render) {
          componentMap[getVueTypeName(`${key}${item}`, "antd")] =
            module[item].type;
        } else if (typeof module[item] === "function") {
          componentMap[getVueTypeName(`${key}${item}`, "antd")] = module[item];
        }
      }
    });
  }
  // 双驼峰转中划线
  componentMap[getVueTypeName(key, "antd")] = module;
});
// 在黑名单中的不会展示
const blackList = [
  "antd-affix",
  "antd-anchor",
  "antd-alert",
  "antd-back-top",
  "antd-avatar",
  "antd-breadcrumb",
  "antd-calendar",
  "antd-card",
  "antd-carousel",
  "antd-config-provider",
  "antd-drawer",
  "antd-empty",
  "antd-image",
  "antd-grid",
  "antd-layout",
  "antd-list",
  "antd-mentions",
  "antd-popover",
  "antd-rate",
  "antd-result",
  "antd-row",
  "antd-col",
  "antd-skeleton",
  "antd-slider",
  "antd-spin",
  "antd-message",
  "antd-notification",
  "antd-version",
  "antd-form-list",
  "antd-form-error-list",
  "antd-form-provider",
  "antd-typography",
  "antd-typography-link",
  "antd-typography-paragraph",
  "antd-upload",
  "antd-button-group",
  "antd-radio-button", // 没有这个组件，无需展示
];
export const antdList = Object.keys(componentMap)
  .filter((i) => !blackList.includes(i))
  .map(async (key) => {
    const res = await requestComponentProps(key);
    return {
      _type: "antd4",
      w: 200,
      h: 60,
      name: key,
      description: res.props.description,
      displayName: res.props.displayName || key,
      cagegory: "Ant Design",
      component: key,
      props: getMockedProps(res.props),
    };
  });

export default componentMap;
