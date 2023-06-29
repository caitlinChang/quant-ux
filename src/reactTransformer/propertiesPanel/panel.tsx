import React, { useEffect } from "react";
import ReactDom from "react-dom";
import { Tree, Tooltip, Space } from "antd";
import { requestComponentProps } from "../util/request";
import { getTSType } from "../util/resolvePropsConfig";
import { PropItemConfigType, RenderConfigType } from "../util/type";
import { get, isArray } from "lodash";
import {
  PlusOutlined,
  MinusOutlined,
  SisternodeOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { getTreeNode } from "../util/common";

const Panel = (widget: any) => {
  const [propsList, setPropsList] = React.useState([]);
  console.log("生成panel");
  const resolveComponentProps = async (name: string) => {
    const res = await requestComponentProps(name);
    const { props } = res;
    const list = Object.values(props);
    const propsList = list
      .map((item) => getTSType(item))
      .filter((item) => item?.renderConfig);
    // transfer
    const treeData = propsList
      .map((propItem) => {
        const node = getTreeNode(propItem, "", widget.props);
        if (isArray(node)) {
          return node;
        }
        return [node];
      })
      .flat();
    setPropsList(treeData);
  };

  useEffect(() => {
    resolveComponentProps(widget.name);
  }, []);

  return <Tree treeData={propsList} showLine />;
};

export const createPanel = (props, container) => {
  const element = React.createElement(Panel, props);
  ReactDom.render(element, container);
};
export const removePanel = (container: HTMLElement) => {
  ReactDom.unmountComponentAtNode(container);
};
export default Panel;
