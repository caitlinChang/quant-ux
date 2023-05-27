import * as antdComponents from "antd";

const componentMap = {};

const getVueTypeName = (key, prefix) => {
  const name = key
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
  return prefix ? `${prefix}-${name}` : name;
};

const nextComponent = ["Button", "Typography", "Radio", "Checkbox"];

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
        }
      }
    });
  }
  // 双驼峰转中划线
  componentMap[getVueTypeName(key, "antd")] = module;
});
// console.log("componentMap = ", componentMap);
export default componentMap;
