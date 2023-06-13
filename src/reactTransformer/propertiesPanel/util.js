import componentConfigList from "../componentList";
import { get } from "lodash";

// 因为 react-typescript-docgen 把所有类型都解析成一个字符串了，所以需要判断一下
const getExactType = (name) => {
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

function getEnum(str) {
  const regex = /"(.*?)"/g;
  const matches = str.match(regex);

  if (matches) {
    const textContents = matches.map((match) => match.replace(/"/g, ""));
    return textContents;
  } else {
    console.warn("No matches found.");
  }
}

// 判断它的 TS 类型是什么，然后决定如何渲染配置
export const getTSType = (propsConfig) => {
  const [type, list] = getExactType(propsConfig.type.name);

  // 过滤掉一些 className 的配置，或者AriaAttributes的配置
  if (/className|ClassName|aria-/.test(propsConfig.name)) {
    return null;
  }
  // 过滤掉没有 description 的
  if (!propsConfig.description) {
    return null;
  }
  switch (type) {
    case "ReactNode":
      return "ReactNode";
    case "string":
      return renderString(propsConfig);
    case "number":
      return renderNumber(propsConfig);
    case "boolean":
      return renderBoolean(propsConfig);
    case "enum":
      return renderEnum(propsConfig, list);
    case "array":
      return renderArray(propsConfig); // 渲染自增数据
    case "any":
      return null;
    case "() => void":
      // return "function";
      return null;
    default:
      return null;
  }
};

function renderArray(propsConfig) {
  // 也许需要mock数据
  const fieldNames = getFieldNames(propsConfig);
  return {
    ...propsConfig,
    renderConfig: {
      type: "array",
      fieldNames,
    },
  };
}

function renderString(data) {
  const defaultValue = data.defaultValue || "";
  return {
    ...data,
    renderConfig: {
      component: "a-input",
      decorator: {
        initialValue: defaultValue,
      },
      props: {
        placeholder: "请输入",
      },
    },
  };
}

function renderBoolean(data) {
  const defaultValue = data.defaultValue;
  const _default = defaultValue === true ? defaultValue : false;
  return {
    ...data,
    renderConfig: {
      component: "a-switch",
      decorator: {
        // initialValue: _default,
      },
      props: {},
    },
  };
}

function renderNumber(data) {
  const defaultValue = data.defaultValue || undefined;
  return {
    ...data,
    renderConfig: {
      component: "a-input-number",
      decorator: {
        initialValue: defaultValue,
      },
      props: {},
    },
  };
}
/**
 * 渲染枚举值
 * @param {*} data
 * @param {*} list
 * @returns
 */
function renderEnum(data, list) {
  const options = list.map((item) => {
    return {
      label: item,
      value: item,
    };
  });
  if (list.length <= 3) {
    return {
      ...data,
      renderConfig: {
        component: "a-radio-group",
        decorator: {
          initialValue: data.defaultValue,
        },
        props: {
          options: options,
        },
      },
    };
  } else {
    return {
      ...data,
      renderConfig: {
        component: "a-select",
        decorator: {
          initialValue: data.defaultValue,
        },
        props: {
          getPopupContainer: () =>
            document.getElementById("properties-warpper"),
          options: options,
          style: "width: 120px",
        },
      },
    };
  }
}
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
  }
};
/**
 * 获取匹配属性面板的自增组件的字段，一般来讲，需要 label 和 value
 * 类似于获取 fieldNames
 * @param {*} propsConfig
 * @returns
 */
export const getFieldNames = (propsConfig) => {
  let _label = "label";
  let _value = "value";
  const itemMap = propsConfig.type?.item;
  if (!itemMap)
    return {
      label: _label,
      value: _value,
    };
  const keys = Object.keys(itemMap);
  if (!keys.length)
    return {
      label: _label,
      value: _value,
    };
  // 适用于 antd 组件的命名规则
  if (/ReactNode/.test(itemMap.title)) {
    _label = "title";
  }
  if (/ReactNode/.test(itemMap.label)) {
    _label = "label";
  }

  if (/string/.test(itemMap.value)) {
    _value = "value";
  }
  if (/string/.test(itemMap.key)) {
    _value = "key";
  }
  if (/string/.test(itemMap.dataIndex)) {
    _value = "dataIndex";
  }
  const obj = {
    label: _label,
    value: _value,
  };

  if (itemMap.disabled) {
    obj.disabled = false;
  }
  if (itemMap.icon) {
    obj.icon = "icon";
  }
  return obj;
};

/**
 * 获取组件中具体某个属性的类型，用于props中第一层的属性
 * @param {*} propsNamePath
 * @param {*} componentName
 */
export const getPropType = (propsName, propsConfig) => {
  const typeName = get(propsConfig, `${propsName}.type.name`);
  const properties = get(propsConfig, `${propsName}.type`);
  if(!typeName) {
    return null
  }
  const [type, list] = getExactType(typeName);
  return {
    type,
    properties,
  };
};
/**
 * 获取组件中具体某个属性的类型，用于props中非第一层的属性
 * @param {*} propsNamePath
 * @param {*} componentName
 * @returns
 */
export const getNestedPropType = (type, properties) => {
  if (type === "array") {
    // 返回 item 中是 ReactNode类型的 key
    if (properties.item && Object.keys(properties.item).length) {
      const itemList = Object.keys(properties.item);
      const reactNodeItemList = itemList.filter((i) => {
        const [itemType, list] = getExactType(properties.item[i]);
        return itemType === "ReactNode";
      });
      return reactNodeItemList;
    }
  } else if (type === "object") {
    // 返回 item 中是 ReactNode类型的 key
  } else {
    // 暂不处理
  }
};
