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

const handleChange = (value, name) => {
  console.log("props 发生编辑", value, name);
};

function renderString(data) {
  const defaultValue = data.defaultValue;
  return {
    ...data,
    renderConfig: {
      component: "a-input",
      props: {
        value: defaultValue,
        // size: "middle",
        placeholder: "请输入",
        border: true,
        onChange: (e) => handleChange(e.target.value, data.name),
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
        value: _default,
        // size: "middle",
        onChange: (value) => handleChange(value, data.name),
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
        value: _default,
        // size: "middle",
        onChange: (value) => handleChange(value, data.name),
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
          value: data.defaultValue,
          options: options,
          type: "button",
          // size: "middle",
          // onChange: (value) => handleChange(value, data.name),
        },
      },
    };
  } else {
    return {
      ...data,
      renderConfig: {
        component: "a-select",
        props: {
          value: data.defaultValue,
          getPopupContainer: () =>
            document.getElementById("properties-warpper"),
          // size: "middle",
          // onChange: (value) => handleChange(value, data.name),
          options: options,
        },
      },
    };
  }
}
