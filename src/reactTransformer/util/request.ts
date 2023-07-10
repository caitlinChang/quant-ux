function revertName(name) {
  const words = name.split("-");
  words.shift();
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join("");
}
/**
 * 调接口获取解析后的属性
 * @param {*} componentName
 * @returns
 */
export const requestComponentProps = async (componentName) => {
  if (!componentName) return Promise.resolve({ props: {} });
  const arr = componentName.split("-");
  arr.shift();
  const str = arr.join("-");
  // console.log(`获取${str}的组件属性`)
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
