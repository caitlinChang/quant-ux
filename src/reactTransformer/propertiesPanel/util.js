import componentConfigList from "../componentList";
import axios from "axios";
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
