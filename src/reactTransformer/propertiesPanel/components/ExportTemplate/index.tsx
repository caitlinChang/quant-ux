import Handlebars from "handlebars";
import * as prettier from "prettier/standalone";
import * as babel from "prettier/plugins/babel";
import * as esTree from "prettier/plugins/estree";
1
export const componentTemplate = `
import { {{component}} }from '{{componentLib}}'

{{#if hasSubComponent}}
const {{name}} = {{component}}.{{name}}
{{/if}}

const {{demoName}} = ()=>
<{{name}} {{{propsText}}}>{{children}}</{{name}}>
`;

/**
 * @param {Object} propsValue
 *
 * @param {React.Component} componentInstance
 *
 * @returns {void}
 *
 * @description
 **/
export async function formatWidgetExportCodeDemo(formData, widget) {
  const componentPath = widget.componentPath;

  if (Array.isArray(componentPath) && componentPath.length === 0) {
    throw new Error("ComponentPath is empty");
  }

  if(componentPath.length > 2){
    console.warn("暂不支持这么多级嵌套🌝");
  }

  const {children, ...restProps} = formData;
  const formatProps = [];

  for (let propsKey in restProps) {
    const propsValue = restProps[propsKey];
    if (typeof propsValue !== "object" || typeof propsValue !== "string") {
      formatProps.push(`${propsKey}="${propsValue}"`);
    } else {
      formatProps.push(`${propsKey}={${JSON.stringify(propsValue)}}`);
    }
  }

  const template = Handlebars.compile(componentTemplate);

  // 根据 componentPath 判断是否为模块下的子组件, 例如 Input.Group
  const componentName = componentPath[0];

  let name = componentName;
  const hasSubComponent = componentPath.length > 1;
  if (hasSubComponent) {
    name = componentPath[1];
  }

  const result = template({
    name,
    component: componentName,
    // TODO: 先写死 antd, 后续需要根据组件库的配置来读取, 如 formula
    componentLib: "antd",
    hasSubComponent: true,
    propsText: formatProps.join(" "),
    children,
    demoName: `${name}Demo`,
  });

  const formatted = await prettier.format(result, {
    parser: "babel",
    plugins: [babel, esTree]
  });

  return formatted
}
