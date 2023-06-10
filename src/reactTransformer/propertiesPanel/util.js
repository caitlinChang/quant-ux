import componentConfigList from "../componentList";

// 因为 react-typescript-docgen 把所有类型都解析成一个字符串了，所以需要判断一下
const getExactType = (name) => {
  const isEnum = !name.split(" | ").length;
  if (isEnum) {
    const arr = name.split(" | ");
    const hasTypeStr = arr.find((item) => {
      if (!/^\"*\"$/g.test(item)) {
        // 存在字符串
        return true;
      }
    });
    if (hasTypeStr) {
      // 存在类型字符串，那就是个 union 类型
      if (arr.includes("ReactNode")) {
        return ["ReactNode", null];
      } else {
        // 不处理
        return ["any", null];
      }
    } else {
      // 不存在，那就认为是 enum
      return ["enum", arr];
    }
  }
  const isArray = name.includes("[]");
  if (isArray) {
    return ["array", []];
  }
  return [name, null];
};

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

function renderArray(data) {
  // 也许需要mock数据
  return {
    ...data,
    renderConfig: {
      type: "array",
      // component: "a-input",
      // decorator: {},
      // props: {},
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
        },
      },
    };
  }
}

export const requestComponentProps = async (componentName) => {
  const str = componentName.split("-")[1];
  try {
    const res = require("../props/" + str + ".json"); //await axios.get("../props/" + str + ".json");
    return res[0];
  } catch (err) {
    console.log("获取组件属性失败", err);
  }
};
