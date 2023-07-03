import React, { useEffect, ReactNode, useMemo } from "react";
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
  Tooltip,
  Space,
} from "antd";
import { requestComponentProps } from "../util/request";
import { getTSType } from "../util/resolvePropsConfig";
import { isArray, set, get, clone } from "lodash";
import { PropItemConfigType, TypeName } from "../util/type";
import { getFirstKey, transferPath } from "../util/propsValueUtils";
import eventBus from "../eventBus";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import SlotRender from "./components/SlotRender";
import { formatPath } from "../util/common";

const AntdPanel = Collapse.Panel;



const Panel = () => {
  const [treeData, setTreeData] = React.useState([]);
  const [propsConfig, setPropsConfig] = React.useState(null);
  const [formData, setFormData] = React.useState({}); // 维护的是组件的 props
  const [selectWidget, setSelectWidget] = React.useState(null); // 当前选中的 widget

  const resolveComponentProps = async (name: string) => {
    const res = await requestComponentProps(name);
    const list = Object.values(res.props);
    const propsConfig = list
      .map((item) => getTSType(item))
      .filter((item) => item?.renderConfig);
    setPropsConfig(propsConfig);
    return propsConfig;
  };
  const handleChangeProp = (path, _value) => {
    console.log("handleChangeProp = ", path, _value);
    const { key, value, newFormData } = transferPath(path, _value, formData);
    setFormData(newFormData);
    eventBus.emit(`${selectWidget.id}:propsUpdate`, newFormData);
    eventBus.emit("updateModel", key, value);
  };

  const handleSelectComponent = (path: string) => {
    eventBus.emit("fillSlot", {
      path,
      id: selectWidget.id,
      formData,
    });
  };

  useEffect(() => {
    getTreedata(propsConfig, formData);
  }, [formData, propsConfig]);

  const renderProp = (node: {
    title: ReactNode;
    key: string;
    config: PropItemConfigType;
  }) => {
    if (!node.config) {
      return;
    }
    const value = get(formData, node.key);
    const defaultValue = node.config.defaultValue;
    const {
      type: { name, item },
    } = node.config;

    if (name === TypeName.Choice) {
      const options = node.config.type.enum?.map?.((i) => {
        return { label: i, value: i };
      });
      return (
        <Radio.Group
          options={options}
          value={value}
          onChange={(e) => handleChangeProp(node.key, e.target.value)}
        />
      );
    } else if (name === TypeName.String) {
      return (
        <Input
          value={value}
          onBlur={(e) => handleChangeProp(node.key, e.target.value)}
        />
      );
    } else if (name === TypeName.Number) {
      return (
        <InputNumber
          value={value}
          onBlur={(value) => handleChangeProp(node.key, value)}
        />
      );
    } else if (name === TypeName.Boolean) {
      return (
        <Switch
          value={value}
          onChange={(value) => handleChangeProp(node.key, value)}
        />
      );
    } else if (name === TypeName.ReactNode) {
      return (
        <SlotRender
          node={node}
          value={value}
          onChange={(value) => handleChangeProp(node.key, value)}
          onSelectComponent={() => handleSelectComponent(node.key)}
        />
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
      type: { item, name },
    } = config;
    const _title = config.description || config.name;
    const title = index >= 0 ? `${_title} - ${index + 1}` : _title;

    const handleDelete = () => {
      const oldValue = get(props.propsValue, props.path) || [];
      const newValue = clone(oldValue);
      newValue.splice(index, 1);
      handleChangeProp(props.path, newValue);
    };
    const handleAdd = () => {
      // TODO: 对添加项的 mock
      const newValue = get(props.propsValue, props.path) || [];
      newValue.push({});
      handleChangeProp(props.path, newValue);
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
        {name === "array" && index === -1 && (
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

  const getTreeNode = (
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
            const _config =
              info.type.name === TypeName.Children
                ? { ...config, description: "Children", name: "children" }
                : info;
            return getTreeNode(_config, `${curPath}[${index}]`, propsValue);
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

  const getTreedata = (propsConfig, data) => {
    if (propsConfig) {
      const treeData = propsConfig
        .map((propItem) => {
          const node = getTreeNode(propItem, "", data);
          if (isArray(node)) {
            return node;
          }
          return [node];
        })
        .flat();
      setTreeData(treeData);
    }
  };

  useEffect(() => {
    eventBus.on("canvasEdit", (path, value, updateCanvas) => {
      // 通知 model 更新
      if (!path) {
        // 传入的不是props中的某个字段，而是整个props
        console.log("update value = ", value);
        setTimeout(() => {
          setFormData({ ...value });
        });
        Object.keys(value).forEach((key) => {
          // this.$emit("setComponentProps", key, value[key]);
        });
        return;
      }
      const key = getFirstKey(path);
      const newValue = set(formData, path, value);

      if (updateCanvas) {
        // 通过contextMenu 修改的值，需要通过 eventBus 通知组件更新
        eventBus.emit(`${selectWidget.id}:propsUpdate`, {
          [key]: newValue[key],
        });
      }
      // this.$emit("setComponentProps", key, newValue[key]);
    });

    eventBus.on("selectWidget", async (widget) => {
      const propsConfig = await resolveComponentProps(widget.component);
      setFormData(widget.props || {});
      setSelectWidget(widget);
      getTreedata(propsConfig, { ...widget.props });
      // 用于接收画布侧的数据
      eventBus.on(`${widget.id}:canvasUpdate`, (key, value) => {
        const newValue = set(formData, key, value);
        setFormData(newValue);
        getTreedata(propsConfig, newValue);
        eventBus.emit("updateModel", key, value);
      });
    });
    eventBus.on("deSelectWidget", () => {
      setPropsConfig(null);
      setFormData(null);
      setSelectWidget(null);
    });
    return () => {
      eventBus.off("canvasEdit");
      eventBus.off("canvasUpdate");
      eventBus.off("selectWidget");
    };
  }, []);

  return (
    <div>
      {!!selectWidget?.id && (
        <>
          <Typography.Title level={5}>Menu</Typography.Title>
          <Form>{renderChildren(treeData)}</Form>
        </>
      )}
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
