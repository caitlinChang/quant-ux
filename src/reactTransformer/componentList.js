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
      return config[0];
    }
  } catch (e) {
    // console.log('e = ', e)
  }
  return fakeProps;
};

// 在黑名单中的不会展示
const blackList = [
  "antd-affix",
  "antd-anchor",
  "antd-alert",
  "antd-back-top",
  "antd-avatar",
  "antd-breadcrumb",
  "antd-calendar",
  "antd-card",
  "antd-carousel",
  "antd-config-provider",
  "antd-drawer",
  "antd-empty",
  "antd-image",
  "antd-grid",
  "antd-layout",
  "antd-list",
  "antd-mentions",
  "antd-popover",
  "antd-rate",
  "antd-result",
  "antd-row",
  "antd-col",
  "antd-skeleton",
  "antd-slider",
  "antd-spin",
  "antd-message",
  "antd-notification",
  "antd-version",
  "antd-form-list",
  "antd-form-error-list",
  "antd-form-provider",
  "antd-typography",
  "antd-typography-link",
  "antd-typography-paragraph",
  "antd-upload",
  "antd-button-group",
  "antd-radio-button", // 没有这个组件，无需展示
];

const componentConfigList = Object.keys(componentMap)
  .filter((i) => !blackList.includes(i))
  .map((key) => {
    const propsConfig = getInitialProps(key);
    return {
      _type: "antd4",
      w: 200,
      h: 60,
      name: key,
      description: propsConfig.description,
      displayName: propsConfig.displayName || key,
      cagegory: "Ant Design",
      component: key,
      props: propsConfig.propsValue || {},
    };
  });

export default componentConfigList;
