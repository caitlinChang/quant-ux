import { v4 as uuidv4 } from "uuid";
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

// const componentConfigList = Object.keys(componentMap).map((key) => {
//   const initialProps = getInitialProps(key);
//   return {
//     _type: "antd4",
//     type: "antd4",
//     // w: 200,
//     // h: 60,
//     // "name":"Typography.Text.1",
//     displayName:key,
//     cagegory:'Text',
//     component: key,
//     id: uuidv4(),
//     props: initialProps,
//   }
// })
const componentConfigList = [
  {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    name: "Typography.Text.1",
    displayName: "文本",
    cagegory: "常用",
    component: "antd-typography-text",
    id: uuidv4(),
    props: {
      children: "请编辑",
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    name: "Typography.Text.1",
    displayName: "标题",
    cagegory: "常用",
    component: "antd-typography-title",
    id: uuidv4(),
    props: {
      children: "请编辑",
      level: 3,
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    name: "Typography.Text.1",
    displayName: "按钮",
    cagegory: "常用",
    component: "antd-button",
    id: uuidv4(),
    props: {
      children: "请编辑",
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    name: "Typography.Text.1",
    displayName: "单行输入",
    cagegory: "表单",
    component: "antd-input",
    id: uuidv4(),
    props: {
      // value: "请编辑",
      placeholder: "请输入",
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    name: "Typography.Text.1",
    displayName: "下拉选择器",
    cagegory: "表单",
    component: "antd-select",
    id: uuidv4(),
    props: {
      // value: "请编辑",
      placeholder: "请选择",
      options: [{ label: "可编辑", value: 0 }],
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    name: "Typography.Text.1",
    displayName: "单选",
    cagegory: "表单",
    component: "antd-radio",
    id: uuidv4(),
    props: {
      value: "请编辑",
      checked: true,
      // placeholder: "请选择",
      // options: [{ label: "可编辑", value: 0 }],
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    name: "Typography.Text.1",
    displayName: "复选",
    cagegory: "表单",
    component: "antd-checkbox",
    id: uuidv4(),
    props: {
      value: "请编辑",
      checked: true,
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    name: "Typography.Text.1",
    displayName: "单选组",
    cagegory: "表单",
    component: "antd-radio-group",
    id: uuidv4(),
    props: {
      value: 0,
      options: [
        { label: "可编辑_1", value: 0 },
        { label: "可编辑_2", value: 1 },
      ],
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    name: "Typography.Text.1",
    displayName: "复选组",
    cagegory: "表单",
    component: "antd-checkbox-group",
    id: uuidv4(),
    props: {
      value: 0,
      options: [
        { label: "可编辑_1", value: 0 },
        { label: "可编辑_2", value: 1 },
      ],
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    name: "Typography.Text.1",
    displayName: "开关",
    cagegory: "表单",
    component: "antd-switch",
    id: uuidv4(),
    props: {
      value: 0,
      children: "可编辑",
    },
  },
];
export default componentConfigList;
