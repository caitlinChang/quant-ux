import { PropItemConfigType } from "./type";

function getEnum(str: string) {
  const regex = /"(.*?)"/g;
  const matches = str.match(regex);

  if (matches) {
    const textContents = matches.map((match) => match.replace(/"/g, ""));
    return textContents;
  } else {
    console.warn("No matches found.");
  }
}
// 因为 react-typescript-docgen 把所有类型都解析成一个字符串了，所以需要判断一下
export const getExactType = (name: PropItemConfigType["type"]["name"]) => {
  const contents = getEnum(name);
  if (contents) {
    // 存在类型字符串，那就是个 union 类型
    if (contents.includes("ReactNode")) {
      return ["ReactNode", null];
    } else {
      // 不存在，那就认为是 enum
      return ["enum", contents];
    }
  }
  const isArray = name.includes("[]");
  if (isArray) {
    return ["array", []];
  }
  return [name, null];
};
