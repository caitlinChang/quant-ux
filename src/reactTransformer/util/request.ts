/**
 * 调接口获取解析后的属性
 * @param {*} componentName
 * @returns
 */
export const requestComponentProps = async (componentName) => {
  if (!componentName) return Promise.resolve({ props: {} });
  let name = componentName;
  // console.log(`获取${str}的组件属性`)
  try {
    const res = require("../props/" + name + ".json"); //await axios.get("../props/" + str + ".json");
    return res[0];
  } catch (err) {
    console.log("requestComponentProps 获取组件属性失败", err);
    return {
      props: {},
    };
  }
};

export const requestPropsConfig = (componentName) => {
  if (!componentName) return { props: {} };
  let name = componentName;
  try {
    const res = require("../props/" + name + ".json"); //await axios.get("../props/" + str + ".json");
    return res[0];
  } catch (err) {
    console.log("requestPropsConfig 获取组件属性失败", err);
    return {
      props: {},
    };
  }
};
