import { v4 as uuidv4 } from "uuid";
export default [
  {
    _type: "antd4",
    type: "antd4",
    w: 200,
    h: 60,
    // "name":"Typography.Text.1",
    component: "antd-input",
    id: uuidv4(),
    props: {
      placeholder: "请输入",
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    w: 200,
    h: 60,
    // "name":"Typography.Text.2",
    component: "typography-text",
    id: uuidv4(),
    props: {
      type: "success",
      children: "Ant Design (success)",
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    w: 200,
    h: 60,
    // "name":"Typography.Text.2",
    component: "typography-text",
    id: uuidv4(),
    props: {
      type: "warning",
      children: "Ant Design (warning)",
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    w: 200,
    h: 60,
    // "name":"Typography.Text.2",
    component: "typography-text",
    id: uuidv4(),
    props: {
      mark: true,
      children: "Ant Design (mark)",
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    w: 200,
    h: 60,
    // "name":"Typography.Text.2",
    component: "typography-text",
    id: uuidv4(),
    props: {
      code: true,
      children: "Ant Design (code)",
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    w: 200,
    h: 60,
    // "name":"Typography.Text.2",
    component: "antd-switch",
    id: uuidv4(),
    props: {
      // code: true,
      // children: "Ant Design (code)",
    },
  },
  {
    _type: "antd4",
    type: "antd4",
    w: 200,
    h: 60,
    // "name":"Typography.Text.2",
    component: "radio-group",
    id: uuidv4(),
    props: {
      options: [
        {
          value: "icon",
          label: "icon",
        },
        {
          value: "text",
          label: "text",
        },
        {
          value: "both",
          label: "both",
        },
      ],
    },
  },
];
