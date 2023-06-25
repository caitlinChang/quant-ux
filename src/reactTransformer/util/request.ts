/**
 * 调接口获取解析后的属性
 * @param {*} componentName
 * @returns
 */
export const requestComponentProps = async (componentName) => {
  const str = componentName.split("-")[1];
  try {
    const res = require("../props/" + str + ".json"); //await axios.get("../props/" + str + ".json");
    return res[0];
  } catch (err) {
    console.log("获取组件属性失败", err);
    return {
      props: {},
    };
  }
};
