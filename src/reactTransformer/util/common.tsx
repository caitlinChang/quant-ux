import { PropItemConfigType, TypeName, ObjectItemType } from "./type";
import React, { ReactNode } from "react";
import { get, isObject } from "lodash";
import { Tooltip, Space } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  SisternodeOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
/**
 *
 * @param title 节点名称
 * @param hasChildren 是否可以添加下一级
 * @param isArrayItem 是否是数组项，是数组项才可以自增自减
 * @param required 是否是必填的项，必填的项不可以 clear
 * @returns
 */
const TreeNodeTitle = (props: {
  title: ReactNode;
  isArrayItem?: boolean;
  hasChildren?: boolean;
  required?: boolean;
}) => {
  const {
    title,
    isArrayItem = false,
    hasChildren = false,
    required = false,
  } = props;
  return (
    <Space>
      {title}
      {!required && (
        <Tooltip title="清空">
          <CloseCircleFilled />
        </Tooltip>
      )}
      {isArrayItem && (
        <Tooltip title="添加子项">
          <MinusOutlined />
        </Tooltip>
      )}
      {hasChildren && (
        <Tooltip title="添加子项">
          <SisternodeOutlined />
        </Tooltip>
      )}
    </Space>
  );
};

function getEnum(str: string) {
  const regex = /"(.*?)"/g;
  const matches = str.match(regex);

  if (matches) {
    const textContents = matches.map((match) => match.replace(/"/g, ""));
    return textContents;
  } else {
    console.warn("No matches found.");
  }
}
// 因为 react-typescript-docgen 把所有类型都解析成一个字符串了，所以需要判断一下
export const getExactType = (name: PropItemConfigType["type"]["name"]) => {
  const contents = getEnum(name);
  if (contents) {
    // 存在类型字符串，那就是个 union 类型
    if (contents.includes("ReactNode")) {
      return ["ReactNode", null];
    } else {
      // 不存在，那就认为是 enum
      return ["enum", contents];
    }
  }
  const isArray = name.includes("[]");
  if (isArray) {
    return ["array", []];
  }
  return [name, null];
};

// 从 propsConfig 中找到 受控组件的事件和状态字段
export const findControlledProps = (propsConfig: {
  [key: string]: PropItemConfigType;
}) => {
  const controlledProps: {
    value?: string;
    onChange?: string;
    valuePath?: string;
  } = {};
  Object.entries(propsConfig).forEach(([key, item]) => {
    if (item.controlledState) {
      controlledProps.value = key;
    }
    if (item.controlledEvent) {
      controlledProps.onChange = key;
      controlledProps.valuePath = item.valuePath;
    }
  });
  if (controlledProps.value && controlledProps.onChange) {
    return controlledProps;
  }
  return null;
};

export const formatPath = (path) => {
  if (path) {
    return path;
  } else {
    return `${path}.`;
  }
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

  if (name === TypeName.Object) {
    return {
      title: (
        <TreeNodeTitle
          title={config.description || config.name}
          required={config.required}
        />
      ),
      key: curPath,
      children: Object.entries(property).map(([_, info]) => {
        return getTreeNode(info, curPath, propsValue);
      }),
    };
    // TODO: 等待后端协议
  } else if (name === TypeName.Array) {
    const value = get(propsValue, path) || [];
    return {
      title: (
        <TreeNodeTitle
          title={config.name}
          required={config.required}
          hasChildren={true}
        />
      ),
      key: curPath,
      children: value.map((_, index) => {
        const hasChildren = !!item.children;
        return {
          title: (
            <TreeNodeTitle
              title={`${config.name} - ${index}`}
              required={config.required}
              hasChildren={hasChildren}
              isArrayItem={true}
            />
          ),
          key: `${curPath}[${index}]`,
          children: Object.entries(item).map(([_, info]) => {
            // 如果是 Children 类型，就是依然将父级的propsConfig 当作自己的 Config 传进去
            const _config =
              info.type.name === TypeName.Children ? config : info;
            return getTreeNode(_config, `${curPath}[${index}]`, propsValue);
          }),
        };
      }),
    };
  } else {
    // 其他普通类型
    return {
      title: (
        <TreeNodeTitle
          title={config.description || config.name}
          required={config.required}
        />
      ),
      key: curPath,
    };
  }
};
