import React, { useEffect, ReactNode } from "react";
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
import { transferPath } from "../util/propsValueUtils";
import eventBus from "../eventBus";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import SlotRender from "./components/SlotRender";
import { formatPath } from "../util/common";
import ColorRender from "./components/ColorRender";
import { formatWidgetExportCodeDemo } from "./components/ExportTemplate";
import StyleRender from "./components/StyleRender";
import CSSPropertiesRender from "./components/CSSPropertiesRender";
import "./panel.less";

const AntdPanel = Collapse.Panel;
const { TabPane } = Tabs;

const Panel = (props: {
  widget: any;
  selectChild: any;
  updateModel?: (key: string, value: any, doNotRender?: boolean) => void;
}) => {
  const { selectChild } = props;
  const [treeData, setTreeData] = React.useState([]);
  const [propsConfig, setPropsConfig] = React.useState(null);
  const [widgetProps, setWidgetProps] = React.useState({}); // 维护当前选中 Widget 的Props
  const [formData, setFormData] = React.useState({}); // 维护的是当前选中组件的 props，可能是 widget，也可能是 widgetChild
  const [selectWidget, setSelectWidget] = React.useState(null); // 当前选中的 widget

  // 选择子组件
  useEffect(() => {
    if (selectChild) {
      renderWidgetProps(selectChild);
      console.log("render child panel");
    }
  }, [selectChild]);

  // 选择组件
  useEffect(() => {
    const { widget } = props;
    if (widget?.id) {
      renderWidgetProps(widget);
      setWidgetProps(cloneDeep(widget.props));
      setSelectWidget(widget);
    } else {
      clear();
    }
  }, [props.widget]);

  useEffect(() => {
    getTreedata(propsConfig, formData);
  }, [formData, propsConfig]);

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
  const handleChangeProp = (path, _value) => {
    if (!selectWidget?.id) {
      console.log("当前没有选中widget", selectWidget);
      return;
    }
    const { key, value, newFormData } = transferPath(path, _value, formData);
    setFormData(cloneDeep(newFormData));
    if (selectChild) {
      // 当前编辑的是 Child
      const res = transferPath(
        `${selectChild.path}[1]`,
        newFormData,
        widgetProps || {}
      );
      eventBus.emit(`${selectWidget.id}:propsUpdate`, res.newFormData);
      props.updateModel?.(res.key, res.value, true);
    } else {
      // 当前编辑的是 Widget
      setWidgetProps(cloneDeep(newFormData));
      eventBus.emit(`${selectWidget.id}:propsUpdate`, newFormData);
      props.updateModel?.(key, value, true);
    }
  };

  const handleSelectComponent = (path: string, index: number) => {
    let _path = `${path}[${index}]`;
    let data = cloneDeep(formData);
    if (selectChild) {
      _path = `${selectChild.path}[1].${_path}`;
      data = cloneDeep(widgetProps);
    }

    eventBus.emit("fillSlot", {
      path: _path,
      id: selectWidget.id,
      formData: data,
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
    const { path } = item;
    if (!path) {
      // 通知 vueWapper 取消内部的各种选中状态
      eventBus.emit(`${item.id}:deSelected`);
      // 调用点击事件的方法 - 切换回 rootWidget
      eventBus.emit("reverseElectionWidget", item);
    } else {
      if (item.path === selectChild.path) {
        return;
      }
      // 调用画布上点击事件的方法 - 切换到某个child
      eventBus.emit("reverseElectionChild", item, path);
    }
  };

  const renderTitle = () => {
    if (!selectChild) {
      return selectWidget?.description;
    } else {
      const path = selectChild.path;
      const reg = /children\[\d+\](\[1\])?/g;
      const arr = path.match(reg) || [];

      const nameList = arr.map((item, index) => {
        let _item = item;
        if (/\[\d+\]\[1\]/.test(item)) {
          _item = item.replace(/\[1\]/, "");
        }
        const _arr = [...arr];
        const r = _arr.slice(0, index);
        r.push(_item);
        const key = r.join(".");
        const [name, props] = get(widgetProps, key) || [];
        return {
          component: name,
          props: props,
          path: key,
        };
      });

      return (
        <Breadcrumb separator=">">
          <Breadcrumb.Item
            style={{ cursor: "pointer" }}
            onClick={() => handleChangeSelected(selectWidget)}
          >
            {selectWidget?.description}
          </Breadcrumb.Item>
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
    }
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
          <Tabs size="small" className="panel_tabs">
            <TabPane className="panel_tab" tab="Settings" key="settings">
              {renderChildren(treeData)}
            </TabPane>
            <TabPane className="panel_tab" tab="Design" key="design">
              <CSSPropertiesRender
                value={formData.style}
                onChange={handleChangeStyle}
              />
            </TabPane>
            <TabPane className="panel_tab" tab="Export" key="export">
              <Button onClick={onWidgetExport}>Export</Button>
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Panel;
