import React, { useEffect, ReactNode, useMemo } from "react";
import {
  Tree,
  Tabs,
  Typography,
  Collapse,
  Radio,
  Input,
  InputNumber,
  Switch,
  Tooltip,
  Space,
  Breadcrumb,
  Button,
} from "antd";
import { requestComponentProps } from "../util/request";
import { isArray, set, get, clone, cloneDeep, rest } from "lodash";
import { PropItemConfigType, TypeName, typeNameList } from "../util/type";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import SlotRender from "./components/SlotRender";
import { formatPath } from "../util/common";
import ColorRender from "./components/ColorRender";
import { formatWidgetExportCodeDemo } from "./components/ExportTemplate";
import StyleRender from "./components/StyleRender";
import CSSPropertiesRender from "./components/CSSPropertiesRender";
import "./panel.less";
import observer, { EventType } from "../eventBus/Observer";
import { getNodeList } from "../path/util";
import { getNodePath } from "../util/getRenderedProps";
import TextContentRender from "./components/TextContentRender";

const AntdPanel = Collapse.Panel;

const Panel = (props: { widget: any; selectChild: any }) => {
  const { selectChild } = props;
  const [treeData, setTreeData] = React.useState([]);
  const [propsConfig, setPropsConfig] = React.useState(null);
  const [formData, setFormData] = React.useState({}); // 维护的是当前选中组件的 props，可能是 widget，也可能是 widgetChild
  const [selectWidget, setSelectWidget] = React.useState(null); // 当前选中的 widget
  const [activeTab, setActiveTab] = React.useState("settings"); // 当前选中的 widget
  // 选择子组件
  useEffect(() => {
    if (selectChild) {
      if (selectChild.component === "text") {
        return;
      } else {
        renderWidgetProps(selectChild);
      }
    }
  }, [selectChild]);

  // 存储根组件
  useEffect(() => {
    const { widget } = props;
    if (widget?.id) {
      setSelectWidget(widget);
    } else {
      clear();
    }
  }, [props.widget]);

  // useEffect(() => {
  //   console.log('formData = ', formData)
  //   getTreedata(propsConfig, formData);
  // }, [formData, propsConfig]);

  const clear = () => {
    setPropsConfig(null);
    setFormData({});
    setSelectWidget(null);
  };

  const renderWidgetProps = async (widget) => {
    const { component, props = {} } = widget;
    const propsConfig = await resolveComponentProps(
      widget.category === "ICON" ? "icon" : component
    );
    console.log('获取最新的 props', props)
    setFormData(cloneDeep(props));
    getTreedata(propsConfig, { ...props });
  };

  const resolveComponentProps = async (name: string) => {
    const res = await requestComponentProps(name);
    const list = Object.values(res.props);
    const propsConfig = list.filter((item: any) => {
      return typeNameList.includes(item.type.name);
    });
    setPropsConfig(propsConfig);

    return propsConfig;
  };
  const handleChangeProp = (path, value) => {
    console.log("path = ", path, value);
    if (!selectWidget?.id) {
      console.log("当前没有选中widget", selectWidget);
      return;
    }
    const newProps = set(cloneDeep(formData), path, value);
    setFormData(newProps);
    observer.notifyPropsUpdate(selectWidget.id, selectChild.path, newProps, {
      path,
      value,
    });
  };

  const handleSelectComponent = (path: string, index: number) => {
    let _path = getNodePath(selectChild.path, `${path}[${index}]`);
    observer.notify(EventType.FILL_WIDGET, {
      id: selectWidget.id,
      path: selectChild.path,
      formData: cloneDeep(formData),
      info: {
        path: _path,
      },
    });
  };

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
    let _value = value;
    if (value === undefined) {
      _value =
        defaultValue !== null && defaultValue !== undefined
          ? defaultValue
          : _value;
    }
    const {
      type: { name },
    } = node.config;

    if (name === TypeName.Choice) {
      const options = node.config.type.enum?.map?.((i) => {
        return { label: i, value: i };
      });
      return (
        <Radio.Group
          options={options}
          value={_value}
          onChange={(e) => handleChangeProp(node.key, e.target.value)}
        />
      );
    } else if (name === TypeName.String) {
      return (
        <Input
          defaultValue={_value}
          allowClear
          onBlur={(e) => handleChangeProp(node.key, e.target.value)}
        />
      );
    } else if (name === TypeName.Number) {
      return (
        <InputNumber
          value={_value}
          allowClear
          onBlur={(e) => handleChangeProp(node.key, e.target.value)}
        />
      );
    } else if (name === TypeName.Boolean) {
      return (
        <Switch
          value={_value}
          onChange={(value) => handleChangeProp(node.key, value)}
        />
      );
    } else if (name === TypeName.ReactNode) {
      return (
        <SlotRender
          node={node}
          value={_value}
          onChange={(value) => handleChangeProp(node.key, value)}
          onSelectComponent={(index: number) =>
            handleSelectComponent(node.key, index)
          }
        />
      );
    } else if (name === TypeName.ColorPicker) {
      return (
        <ColorRender
          value={value}
          onChange={(value) => handleChangeProp(node.key, value)}
        />
      );
    } else if (name === TypeName.Import) {
      // const node =
      // const treeData = getTreedata(node.config, formData);
      // return renderChildren(treeData)
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
    handleChangeProp: (path: string, value: any) => void;
    config: PropItemConfigType;
    path: string;
    propsValue: any;
    index?: number;
  }) => {
    const { index = -1, config } = props;
    const {
      type: { name },
    } = config;
    const _title = config.description || config.name;
    const title = index >= 0 ? `${_title} - ${index + 1}` : _title;

    const handleDelete = () => {
      const oldValue = get(props.propsValue, props.path) || [];
      const newValue = clone(oldValue);
      newValue.splice(index, 1);
      props.handleChangeProp(props.path, newValue);
    };
    const handleAdd = () => {
      // TODO: 对添加项的 mock
      const newValue = get(props.propsValue, props.path) || [];
      newValue.push({});
      props.handleChangeProp(props.path, newValue);
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
              handleChangeProp={handleChangeProp}
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
        <TreeNodeTitle
          handleChangeProp={handleChangeProp}
          propsValue={propsValue}
          path={curPath}
          config={config}
        />
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

  /**
   * 切换现在正在选中的组件
   * @param item
   * @returns
   */
  const handleChangeSelected = (item: any) => {
    observer.notify(EventType.SELECT_WIDGET, item);
  };

  const renderTitle = () => {
    const nameList = getNodeList(selectChild?.path, selectWidget);
    return (
      <Breadcrumb separator=">">
        {nameList.map((item) => {
          return (
            <Breadcrumb.Item
              style={{ cursor: "pointer" }}
              onClick={() => handleChangeSelected(item)}
            >
              <Tooltip title={"点击切换到该子组件"}>{item.component}</Tooltip>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  };

  const onWidgetExport = async () => {
    try {
      const code = await formatWidgetExportCodeDemo(formData, props.widget);
      console.log("onWidgetExport: ", code);
      // 先写入剪切板
      await navigator.clipboard.writeText(code);
    } catch (e) {
      console.log(e);
    }
  };
  const handleChangeStyle = (value) => {
    handleChangeProp("style", value);
  };

  return (
    <div>
      {!!selectWidget?.id && (
        <>
          <Typography.Title level={5}>{renderTitle()}</Typography.Title>
          <Tabs
            size="small"
            className="panel_tabs"
            activeTabKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            items={[
              {
                key: "settings",
                label: "Settings",
                children:
                  selectChild?.component === "text" ? (
                    <TextContentRender {...selectChild} />
                  ) : (
                    renderChildren(treeData)
                  ),
              },
              {
                key: "design",
                label: "Design",
                disabled: selectChild?.component === "text",
                children: (
                  <CSSPropertiesRender
                    value={formData.style}
                    onChange={handleChangeStyle}
                  />
                ),
              },
              {
                key: "export",
                label: "Export",
                disabled: selectChild?.component === "text",
                children: <Button onClick={onWidgetExport}>Export</Button>,
              },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default Panel;
