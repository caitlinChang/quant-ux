import { PropItemConfigType, TypeName, ObjectItemType } from "../util/type";
import React, { ReactNode } from "react";
import { clone, get, isObject } from "lodash";
import { Tooltip, Space } from "antd";
import eventBus from "../eventBus";
import {
  PlusOutlined,
  MinusOutlined,
  SisternodeOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";

export const formatPath = (path) => {
  if (path) {
    return `${path}.`;
  } else {
    return "";
  }
};

/**
 *
 * @param title 节点名称
 * @param hasChildren 是否可以添加下一级
 * @param isArrayItem 是否是数组项，是数组项才可以自增自减
 * @param required 是否是必填的项，必填的项不可以 clear
 * @returns
 */
const TreeNodeTitle = (props: {
  config: PropItemConfigType;
  path: string;
  propsValue: any;
  index?: number;
}) => {
  const { index = -1, config } = props;
  const {
    type: { item },
  } = config;
  const _title = config.description || config.name;
  const title = index >= 0 ? `${_title} - ${index + 1}` : _title;
  const hasChildren = !!item?.children;

  const handleDelete = () => {
    const oldValue = get(props.propsValue, props.path) || [];
    const newValue = clone(oldValue);
    newValue.splice(index, 1);
    // 更新到模型
    eventBus.emit("updateModel", props.path, newValue, props.propsValue);
  };
  const handleAdd = () => {
    // TODO: 对添加项的 mock
    const newValue = clone(get(props.propsValue, props.path)) || [];
    newValue.push({});
    // 更新到模型
    eventBus.emit("updateModel", props.path, newValue, props.propsValue);
  };
  return (
    <Space>
      {title}
      {/* {!required && (
          <Tooltip title="清空">
            <CloseCircleFilled style={{ color: "#e1e1e1", cursor: "pointer" }} />
          </Tooltip>
        )} */}
      {index >= 0 && (
        <>
          <Tooltip title="删除">
            <MinusOutlined
              onClick={handleDelete}
              style={{ color: "#555", cursor: "pointer" }}
            />
          </Tooltip>
        </>
      )}
      {hasChildren && (
        <Tooltip title="添加">
          <PlusOutlined
            onClick={handleAdd}
            style={{ color: "#555", cursor: "pointer" }}
          />
        </Tooltip>
      )}
    </Space>
  );
};

export const getTreeNode = (
  config: PropItemConfigType,
  path: string,
  propsValue
) => {
  const {
    type: { name, item, property },
  } = config;
  const curPath = `${formatPath(path)}${config.name}`;
  let children = [];

  if (name === TypeName.Object) {
    children = Object.entries(property).map(([_, info]) => {
      return getTreeNode(info, curPath, propsValue);
    });
    // TODO: 等待后端协议
  } else if (name === TypeName.Array) {
    const value = get(propsValue, curPath) || [];
    children = value.map((_, index) => {
      return {
        title: (
          <TreeNodeTitle
            propsValue={propsValue}
            path={curPath}
            config={config}
            index={index}
          />
        ),
        key: `${curPath}[${index}]`,
        children: Object.entries(item).map(([_, info]) => {
          // 如果是 Children 类型，就是依然将父级的propsConfig 当作自己的 Config 传进去
          const _config = info.type.name === TypeName.Children ? config : info;
          return getTreeNode(_config, `${curPath}[${index}].${_}`, propsValue);
        }),
      };
    });
  }
  return {
    title: (
      <TreeNodeTitle propsValue={propsValue} path={curPath} config={config} />
    ),
    key: curPath,
    children,
    config: config,
  };
};
