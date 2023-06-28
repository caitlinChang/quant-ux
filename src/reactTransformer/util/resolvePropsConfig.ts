import { getFieldNames } from "./getFieldNames";
import { getExactType } from "./common";
import { PropItemConfigType } from "./type";

// 判断它的 TS 类型是什么，然后决定如何渲染配置
export const getTSType = (propsConfig: any) => {
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

function renderArray(propConfig: PropItemConfigType) {
  // 也许需要mock数据
  const fieldNames = getFieldNames(propConfig);
  return {
    ...propConfig,
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
