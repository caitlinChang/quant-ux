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
  Tooltip,
  Space,
  Breadcrumb,
} from "antd";
import { requestComponentProps } from "../util/request";
import { getTSType } from "../util/resolvePropsConfig";
import { isArray, set, get, clone, cloneDeep } from "lodash";
import { PropItemConfigType, TypeName } from "../util/type";
import { getFirstKey, transferPath } from "../util/propsValueUtils";
import eventBus from "../eventBus";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import SlotRender from "./components/SlotRender";
import { formatPath } from "../util/common";
import { getVueTypeName } from "../util/constant";

const AntdPanel = Collapse.Panel;

const Panel = () => {
  const [treeData, setTreeData] = React.useState([]);
  const [propsConfig, setPropsConfig] = React.useState(null);
  const [widgetProps, setWidgetProps] = React.useState({}); // 维护当前选中 Widget 的Props
  const [formData, setFormData] = React.useState({}); // 维护的是当前选中组件的 props，可能是 widget，也可能是 widgetChild
  const [selectWidget, setSelectWidget] = React.useState(null); // 当前选中的 widget
  const [selectChild, setSelectChild] = React.useState(null); // 当前选中的widget 中的 child
  // console.log("selectWidget = ", selectWidget, selectChild);
  useEffect(() => {
    if (selectChild) {
      return;
    } else {
      setWidgetProps(cloneDeep(formData));
    }
  }, [selectChild, formData]);

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
    if (!selectWidget?.id) {
      console.log("当前没有选中widget", selectWidget);
      return;
    }
    const { key, value, newFormData } = transferPath(path, _value, formData);
    setFormData(newFormData);
    if (selectChild) {
      // 当前编辑的是 Child
      const res = transferPath(
        `${selectChild.path}.1`,
        newFormData,
        widgetProps || {}
      );
      eventBus.emit(`${selectWidget.id}:propsUpdate`, res.newFormData);
      eventBus.emit("updateModel", res.key, res.value);
    } else {
      // 当前编辑的是 Widget
      eventBus.emit(`${selectWidget.id}:propsUpdate`, newFormData);
      eventBus.emit("updateModel", key, value);
    }
  };

  const handleSelectComponent = (path: string, index: number) => {
    let _path = `${path}.${index}`;
    let data = cloneDeep(formData);
    if (selectChild) {
      _path = `${selectChild.path}.1.${_path}`;
      data = cloneDeep(widgetProps);
    }

    eventBus.emit("fillSlot", {
      path: _path,
      id: selectWidget.id,
      formData: data,
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
    let _value = value;
    if (value === undefined) {
      _value =
        defaultValue !== null && defaultValue !== undefined
          ? defaultValue
          : _value;
    }
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
      type: { item, name },
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

  const clear = () => {
    setPropsConfig(null);
    setFormData({});
    setSelectWidget(null);
    setSelectChild(null);
  };

  useEffect(() => {
    eventBus.on("selectWidget", async (widget) => {
      // if (selectWidget?.id === widget.id) {
      //   // 防止重复点击
      //   return;
      // }
      const { component, props = {} } = widget;
      clear();
      const propsConfig = await resolveComponentProps(component);
      setFormData(cloneDeep(props));
      console.log('setFormData props = ', cloneDeep(props))
      setSelectWidget(widget);
      getTreedata(propsConfig, { ...props });
      // 用于接收画布侧的数据
      // TODO: 去掉事件名中的 id
      eventBus.on(`${widget.id}:canvasUpdate`, (key, value) => {
        if (selectChild) {
          console.log(
            "canvasUpdate：Panel 面板正在编辑子组件的属性，无法处理画布事件"
          );
          return;
        }
        console.log('key = ', key, cloneDeep(value))
        console.log('formData = ', cloneDeep(formData));
        console.log('widgetprops = ', cloneDeep(widgetProps));
        const newValue = set(formData, key, value);
        setFormData({ ...newValue });
        getTreedata(propsConfig, newValue);
        eventBus.emit("updateModel", key, value);
      });
    });
    // 用于接收选中 widgetChildren 中的数据变化
    eventBus.on("selectWidgetChild", async (widget) => {
      if (
        widget.component === selectChild?.component &&
        widget.path === selectChild?.path
      ) {
        // 防止重复点击
        return;
      }
      const { component, props = {} } = widget;
      setSelectChild(widget);
      const propsConfig = await resolveComponentProps(component);
      getTreedata(propsConfig, { ...props });
      setFormData(cloneDeep(props));
      // TODO: 去掉事件名中的 id
    });

    // 在画布上编辑子组件的文字时
    eventBus.on("childCanvasUpdate", (key, value) => {
      if (!selectChild) {
        console.log(
          "childCanvasUpdate：当前Panel面板编辑的是根组件属性，没有选中子组件，无法处理子组件的画布事件"
        );
        return;
      }
      const newValue = set(formData, key, value);
      setFormData(newValue);
      getTreedata(propsConfig, newValue);
      //更新下 rootWidget的数据
      const rootKey = `${selectChild.path}.1.${key}`;
      const newInfo = transferPath(rootKey, value, widgetProps);
      setWidgetProps(newInfo.newFormData);
      eventBus.emit("updateModel", newInfo.key, newInfo.value);
    });

    return () => {
      selectWidget?.id && eventBus.off(`${selectWidget.id}:canvasUpdate`);
      eventBus.off("selectWidget");
      eventBus.off("selectWidgetChild");
    };
  }, []);

  const handleChangeSelected = (item: any) => {
    const { path } = item;
    if (!path) {
      // 通知 vueWapper 取消内部的各种选中状态
      eventBus.emit(`${item.id}:deSelected`)
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
      const reg = /children.\d+(.1)?/g;
      const arr = path.match(reg) || [];
      const nameList = arr.map((item, index) => {
        let _item = item;
        if (/.\d+.1/.test(item)) {
          const list = item.split(".");
          list.pop();
          _item = list.join(".");
        }
        const _arr = [...arr];
        const r = _arr.slice(0, index);
        r.push(_item);
        const key = r.join(".");
        const [name, props] = get(widgetProps, key) || [];
        return {
          component: getVueTypeName(name, "antd"),
          props: props,
          path: key,
        };
      });

      return (
        <Breadcrumb separator=">">
          <Breadcrumb.Item style={{ cursor:'pointer'}} onClick={() => handleChangeSelected(selectWidget)}>
            {selectWidget?.description}
          </Breadcrumb.Item>
          {nameList.map((item) => {
            return (
              <Breadcrumb.Item style={{ cursor:'pointer'}} onClick={() => handleChangeSelected(item)}>
                <Tooltip title={'点击切换到该子组件'}>
                  {item.component}
                </Tooltip>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      );
    }
  };

  return (
    <div>
      {!!selectWidget?.id && (
        <>
          <Typography.Title level={5}>{renderTitle()}</Typography.Title>
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
  container && ReactDom.unmountComponentAtNode(container);
};
export default Panel;
