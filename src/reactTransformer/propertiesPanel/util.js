import componentConfigList from "../componentList";
const isENUM = (name) => {
  if (name === "string") {
    return false;
  }
  const arr = name.split(" | ");
  if (arr.length > 1) {
    return arr;
  }
  return false;
};

// 判断它的 TS 类型是什么，然后决定如何渲染配置
export const getTSType = (propsConfig) => {
  const type = propsConfig.type.name;
  const list = isENUM(type);
  switch (type) {
    case "ReactNode":
      return "ReactNode";
    case "string":
      return renderString(propsConfig);
    case "number":
      return renderNumber(propsConfig);
    case "boolean":
      return renderBoolean(propsConfig);
    case "any":
      return null;
    case "() => void":
      // return "function";
      return null;
    default:
      if (list) {
        return renderEnum(propsConfig, list);
      }
      return null;
  }
};
function getComponentConfig(component) {
  return componentConfigList.find((item) => {
    return item.component === component;
  });
}

function renderString(data) {
  const defaultValue = data.defaultValue;
  return {
    ...data,
    renderConfig: {
      component: "a-input",
      props: {
        defaultValue: defaultValue,
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
      props: {
        defaultValue: _default,
      },
    },
  };
}

function renderNumber(data) {
  const defaultValue = data.defaultValue;
  const _default = defaultValue === true ? defaultValue : false;
  return {
    ...data,
    renderConfig: {
      component: "a-input-number",
      props: {
        defaultValue: _default,
      },
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
        props: {
          defaultValue: data.defaultValue,
          options: options,
        },
      },
    };
  } else {
    return {
      ...data,
      renderConfig: {
        component: "a-select",
        props: {
          defaultValue: data.defaultValue,
          getPopupContainer: () =>
            document.getElementById("properties-warpper"),
          options: options,
        },
      },
    };
  }
}
