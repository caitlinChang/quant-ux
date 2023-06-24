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

// 从 propsConfig 中找到 受控组件的事件和状态字段
export const findControlledProps = (propsConfig: {
  [key: string]: PropItemConfigType;
}) => { 
  const controlledProps: {
    value?: string;
    onChange?: string;
    valuePath?: string;
  } = {}
  Object.entries(propsConfig).forEach(([key,item]) => {
    if (item.controlledState) {
      controlledProps.value = key
    }
    if(item.controlledEvent) {
      controlledProps.onChange = key
      controlledProps.valuePath = item.valuePath
    }
  });
  if (controlledProps.value && controlledProps.onChange) { 
    return controlledProps
  }
  return null;
}
