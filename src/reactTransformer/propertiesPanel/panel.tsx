import React, { useEffect } from "react";
import { Tree, Tooltip, Space } from "antd";
import { requestComponentProps } from "../util/request";
import { getTSType } from "../util/resolvePropsConfig";
import { PropItemConfigType, RenderConfigType } from "../util/type";
import { get } from "lodash";
import {
  PlusOutlined,
  MinusOutlined,
  SisternodeOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";

const Panel = (widget: any) => {
  const [propsList, setPropsList] = React.useState([]);

  const resolveComponentProps = async (name: string) => {
    const res = await requestComponentProps(name);
    const { props } = res;
    const list = Object.values(props);
    const propsList = list
      .map((item) => getTSType(item))
      .filter((item) => item?.renderConfig);
    // transfer
    const treeData = propsList.map((propItem) => {
      let children = [];
      const {
        type: { name, property = {}, item = {} },
      } = propItem;
      let hasChildren = false;
      if (name === "object") {
        // TODO: 等待后端协议
      } else if (name === "array") {
        // TODO: 区分不同类型的数组，现在这里只处理的对象数组
        const itemValue = get(widget.props, propItem.name) || []; // 值
        const keys = Object.entries(item);
        children = itemValue.map((_, index) => {
          return {
            title: `${name} - ${index}`,
            key: `${name}[${index}]`,
            children: keys.map(([itemName, type]) => {
              return {
                title: itemName,
                key: `${name}[${index}].${itemName}`,
              };
            }),
          };
        });
      }
      return {
        title: propItem.description || propItem.name,
        key: propItem.name,
        children,
      };
    });
    setPropsList(treeData);
  };

  useEffect(() => {
    resolveComponentProps(widget.name);
  }, []);

  return <Tree treeData={propsList} showLine />;
};

export default Panel;
