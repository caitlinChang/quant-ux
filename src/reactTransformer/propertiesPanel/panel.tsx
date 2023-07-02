import React, { useEffect, ReactNode } from "react";
import ReactDom from "react-dom";
import {
  Tree,
  Typography,
  Collapse,
  Radio,
  Input,
  InputNumber,
  Switch,
  Form,
} from "antd";
import { requestComponentProps } from "../util/request";
import { getTSType } from "../util/resolvePropsConfig";
import { isArray, set, get } from "lodash";
import { PropItemConfigType, TypeName } from "../util/type";
import { getFirstKey } from "../util/propsValueUtils";
import eventBus from "../eventBus";
import { getTreeNode } from "./util";
import SlotRender from "./components/SlotRender";

const AntdPanel = Collapse.Panel;

const Panel = (props: any) => {
  console.log("props = ", props);
  const [treeData, setTreeData] = React.useState([]);
  const [propsConfig, setPropsConfig] = React.useState({});
  const [propsData, setPropsData] = React.useState({});
  const [formData, setFormData] = React.useState({});

  const resolveComponentProps = async (name: string) => {
    const res = await requestComponentProps(name);
    const list = Object.values(res.props);
    const propsList = list
      .map((item) => getTSType(item))
      .filter((item) => item?.renderConfig);

    setPropsConfig(propsList);
    // transfer
    const treeData = propsList
      .map((propItem) => {
        const node = getTreeNode(propItem, "", props.props);
        if (isArray(node)) {
          return node;
        }
        return [node];
      })
      .flat();
    setTreeData(treeData);
  };

  const handleChangeProp = (path, value) => {
    console.log("path = ", path, value);
  };

  const renderProp = (node: {
    title: ReactNode;
    key: string;
    config: PropItemConfigType;
  }) => {
    if (!node.config) {
      return;
    }
    const value = get(propsData, node.key);
    const defaultValue = node.config.defaultValue;
    const {
      type: { name, item },
    } = node.config;
    if (name === TypeName.Choice) {
      console.log("item = ", item);
      return (
        <Form.Item>
          <Radio.Group
            options={[]}
            value={value}
            onChange={(value) => handleChangeProp(node.key, value)}
          />
        </Form.Item>
      );
    } else if (name === TypeName.String) {
      return (
        <Form.Item>
          <Input
            value={value}
            onChange={(value) => handleChangeProp(node.key, value)}
          />
        </Form.Item>
      );
    } else if (name === TypeName.Number) {
      return (
        <Form.Item>
          <InputNumber
            value={value}
            onChange={(value) => handleChangeProp(node.key, value)}
          />
        </Form.Item>
      );
    } else if (name === TypeName.Boolean) {
      return (
        <Form.Item name={node.key}>
          <Switch
            value={value}
            onChange={(value) => handleChangeProp(node.key, value)}
          />
        </Form.Item>
      );
    } else if (name === TypeName.ReactNode) {
      return (
        <Form.Item>
          <SlotRender node={node} value={value} />
        </Form.Item>
      );
    }
  };

  const renderChildren = (children) => {
    return (
      <Collapse bordered={false} ghost>
        {children.map((node) => {
          return (
            <AntdPanel header={node.title} key={node.key} collapsible={"icon"}>
              {!!node.children?.length && renderChildren(node.children)}
              {!node.children?.length && renderProp(node)}
            </AntdPanel>
          );
        })}
      </Collapse>
    );
  };

  useEffect(() => {
    resolveComponentProps(props.component);
    eventBus.on("canvasEdit", (path, value, updateCanvas) => {
      // 通知 model 更新
      if (!path) {
        // 传入的不是props中的某个字段，而是整个props
        console.log("update value = ", value);
        setTimeout(() => {
          setPropsData({ ...value });
        });
        Object.keys(value).forEach((key) => {
          // this.$emit("setComponentProps", key, value[key]);
        });
        return;
      }
      const key = getFirstKey(path);
      const newValue = set(propsData, path, value);

      if (updateCanvas) {
        // 通过contextMenu 修改的值，需要通过 eventBus 通知组件更新
        eventBus.emit(`${props.id}:updateProps`, {
          [key]: newValue[key],
        });
      }
      // this.$emit("setComponentProps", key, newValue[key]);
    });
    return () => eventBus.off("canvasEdit");
  }, []);

  return (
    <div>
      <Typography.Title level={5}>Menu</Typography.Title>
      <Form>{renderChildren(treeData)}</Form>
    </div>
  );
};

export const createPanel = (props, container) => {
  const element = React.createElement(Panel, props);
  ReactDom.render(element, container);
};
export const removePanel = (container: HTMLElement) => {
  ReactDom.unmountComponentAtNode(container);
};
export default Panel;
