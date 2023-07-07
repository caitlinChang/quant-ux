import componentMap from "./util/constant";

export const getInitialProps = (key) => {
  const _name = key.replace(/^antd-/g, "");
  const configUrl = `${_name}.json`;
  let fakeProps = {};
  try {
    const config = require(`./props/${configUrl}`);
    if (config && config[0]) {
      Object.entries(config[0].props).map((item) => {
        const [propsName, propsInfo] = item;
        if (propsInfo.type?.name.indexOf("ReactNode")) {
          fakeProps[propsName] = "请编辑";
        }
      });
      return config[0].props;
    }
  } catch (e) {
    // console.log('e = ', e)
  }
  return fakeProps;
};

// 在黑名单中的不会展示
const blackList = ['affix', 'anchor','back-top','avatar','breadcrumb','calendar','card','carousel']

const _componentConfigList = Object.keys(componentMap).map((key) => {
  const initialProps = getInitialProps(key);
  return {
    _type: "antd4",
    w: 200,
    h: 60,
    name: key,
    displayName:key,
    cagegory:'Ant Design',
    component: key,
    // props: initialProps,
  }
})
console.log('_componentConfigList = ', _componentConfigList);

const componentConfigList = [
  {
    _type: "antd4",
    w: 200,
    h: 60,
    name: "text",
    displayName: "文本",
    cagegory: "常用",
    component: "antd-typography-text",
    props: {
      children: "请编辑",
    },
  },
  {
    _type: "antd4",
    w: 200,
    h: 60,
    name: "title",
    displayName: "标题",
    cagegory: "常用",
    component: "antd-typography-title",
    props: {
      children: "请编辑",
      level: 3,
    },
  },
  {
    _type: "antd4",
    w: 200,
    h: 60,
    name: "button",
    displayName: "按钮",
    cagegory: "常用",
    component: "antd-button",
  },
  {
    _type: "antd4",
    w: 200,
    h: 60,
    name: "input",
    displayName: "单行输入",
    cagegory: "表单",
    component: "antd-input",
    props: {
    },
  },
  {
    _type: "antd4",
    w: 200,
    h: 60,
    name: "select",
    displayName: "下拉选择器",
    cagegory: "表单",
    component: "antd-select",
    props: {
    },
  },
  {
    _type: "antd4",
    w: 200,
    h: 60,
    name: "radio",
    displayName: "单选",
    cagegory: "表单",
    component: "antd-radio",
  },
  {
    _type: "antd4",
    w: 200,
    h: 60,
    name: "checkbox",
    displayName: "复选",
    cagegory: "表单",
    component: "antd-checkbox",
    props: {
      value: "请编辑",
      checked: true,
    },
  },
  {
    _type: "antd4",
    w: 200,
    h: 60,
    name: "radio-group",
    displayName: "单选组",
    cagegory: "表单",
    component: "antd-radio-group",
    props: {
      options: [
        { label: "可编辑_1", value: 0 },
        { label: "可编辑_2", value: 1 },
      ],
    },
  },
  {
    _type: "antd4",
    w: 200,
    h: 60,
    name: "checkbox-group",
    displayName: "复选组",
    cagegory: "表单",
    component: "antd-checkbox-group",
  },
  {
    _type: "antd4",
    w: 200,
    h: 60,
    name: "switch",
    displayName: "开关",
    cagegory: "表单",
    component: "antd-switch",
    props: {
      checked: true,
      children: "可编辑",
    },
  },
  {
    _type: "antd4",
    w: 500,
    h: 300,
    name: "menu",
    displayName: "菜单",
    cagegory: "表单",
    component: "antd-menu",
    props: {
    },
  },
  {
    _type: "antd4",
    w: 500,
    h: 300,
    name: "table",
    displayName: "表格",
    cagegory: "表单",
    component: "antd-table",
    props: {},
  },
];
export default componentConfigList;
