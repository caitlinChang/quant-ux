<template>
    <div class="child-widget-warpper" @dblclick="handleSelectChildren">
      <component :is="componentInfo.component" v-bind="componentProps">
        <template v-if="childrenList.length >= 1" v-slot:default>
          <template v-for="(c,index) in childrenList">
            <slot-wrapper v-if="c.type === 'text'" :props="c.widgetProps" :key="index"/>
            <children-wrapper v-if="c.type === 'component'" :key="index" :componentInfo="c.componentInfo" />
          </template>
        </template>
      </component>
    </div>
  </template>
  
  <script>
  import eventBus from "../eventBus";
  import componentList, { getVueTypeName } from "../util/constant";
  import iconMap from '../util/icon';
  import { requestComponentProps} from '../util/request'
  import { setSlotWrapper, SlotWrapper } from "./SlotWrapper";
  import { getFieldNames } from '../util/getFieldNames';
  import { getMockedProps } from '../util/mock';
  import { clone, get, isArray } from 'lodash';
  import { formatPath } from '../util/common';
  export default {
    name: "ChildrenWrapper",
    components: {
      ...componentList,
      ...iconMap,
      slotWrapper: SlotWrapper,
    },
    props: ["componentInfo"],
    data() {
      return {
        value: undefined, // 受控组件，暂时弃用
        controlledNames: null,// 受控组件，暂时弃用
        componentProps: {}, // 经过 handleProps处理过后的，真正的传给组件的参数
        rawProps:{}, // 原始的 props， 在model中存储的props数据模型
        propsConfig: {}, // props的类型配置信息
        childrenList:[]
      };
    },
    watch: {
        componentInfo: {
            immediate: true,
            handler() {
                if (!this.componentInfo.component) {
                        return;
                }
                this.resolveComponentProps(this.componentInfo.component, this.componentInfo.id);
            }
        }    
    },
    methods: {
      handleSelectChildren() {
        // 选中当前的widgets 的 children
        
      },
      onChange(value) { 
        let _value = value;
        if (this.controlledNames.valuePath) {
          _value = value[this.controlledNames.valuePath]
        }
        this.value = _value;
        //TODO: 更新props
      },
      async resolveComponentProps(name, id) {
        const res = await requestComponentProps(name);
        this.propsConfig = res.props;
        let newProps = {};
        this.rawProps = clone(this.componentInfo.props);
        if (this.rawProps && Object.keys(this.rawProps).length) {
          newProps = clone(this.rawProps);
        } else {
          // children-wrapper 中
          this.rawProps = getMockedProps(res.props);
          newProps = clone(this.rawProps);
          //TODO: 因为 组件是先添加再被选中的，所以这个里的事件触发
          // 会比 panel 中的事件注册更早，所以这里要用setTimeout 
        //   setTimeout(() => {
        //     Object.keys(this.rawProps).forEach(i => {
        //       //mock 的数据也需要更新到 model 中
        //       eventBus.emit(`${id}:canvasUpdate`,i, this.rawProps[i])
        //     })
        //   })
        }
        // 对原始的props 做层slotWrapper 方便画布操作
        const _props = this.handleProps(newProps);
        this.componentProps = _props;
      },
  
      getWrapperProps(config, path, rawProps, fieldNames) {
        const curValue = get(rawProps, path);
        const { name, property, item } = config.type || {};
        if (name === 'ReactNode') {
          // children 需要特殊处理，用 slot 传递
          if (path === 'children') {
            return {
              widgetId: this.componentInfo.id,
              widgetProps: { ...rawProps },
              path: path,
              children: curValue,
              fieldNames,
              meta: [4]
            }
          }
          return setSlotWrapper({
            widgetId: this.componentInfo.id,
            widgetProps: { ...rawProps },
            path: path,
            children: curValue,
            fieldNames,
            meta: [4]
          });
        } else if (name === 'object') { 
          if (curValue) {
            const obj = {};
            Object.keys(curValue).forEach(key => {
              const keyConfig = property[key];
              obj[key] = this.getWrapperProps(keyConfig, `${formatPath(path)}.${key}`, rawProps);
            });
            return obj;
          }
          return curValue;
        } else if (name === 'array') { 
          if (curValue) {
            const fieldNames = getFieldNames(config);
            return curValue.map((_item, index) => {
              const obj = {};
              Object.keys(_item).forEach(key => {
                const keyConfig = item[key];
                if (key === 'children' && keyConfig.type.name === 'children') {
                  obj[key] = this.getWrapperProps({...config,name:'children'}, `${formatPath(path)}[${index}].${key}`, rawProps);
                }else {
                  obj[key] = this.getWrapperProps(keyConfig, `${formatPath(path)}[${index}].${key}`, rawProps, fieldNames);
                }
                
              });
              return obj;
            })
          }
          return curValue;
        } else{
          return curValue;
        }
      },
  
      //处理组件的 props，如果某个props类型是 ReactNode, 要包裹上一层元素，用于处理数据同步
      handleProps(props) {
        const cloneProps = clone(props);
        const obj = {}
        Object.keys(props).map((propsName) => {
            const config = this.propsConfig[propsName]; 
            if (config) {
                obj[propsName] = this.getWrapperProps(config, propsName, cloneProps);
            } else {
                obj[propsName] = cloneProps[propsName];
            }
        });
        const { children, ...restProps } = obj;
        
        this.handleChildren(children);
       
        return restProps;
      },
  
      handleChildren(childrenProps) {
        if (!childrenProps) {
          this.childrenProps = null;
          return;
        }
        const { children, ...rest } = childrenProps
        if (typeof children === 'string') {
          this.childrenList = [{
            type: 'text',
            widgetProps: { ...rest, children: children }
          }]
        } else if (isArray(children)) {
          this.childrenList = children.map(item => {
            if (typeof item === 'string') {
              return {
                type: 'text',
                widgetProps: { ...rest, children: item }
              }
            } else {
              const [name, props] = item;
              return {
                type: 'component',
                componentName: getVueTypeName(name, 'antd'),
                componentProps: {... (props || {})}
              }
          }
         }) 
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .child-widget-warpper{
    position: relative;
  }
  .child-widget-warpper:hover{
    position: relative;
    border:2px dashed #888;
  }
  .widget_action{
    position:absolute;
    z-index:90011;
    top:0;
    left:-40px;
  }
  .widget_action-actived{
    width:28px;
    height:28px;
    padding: 4px;
    border-radius: 50%;
    background: #fff;
    border:1px solid #fff;
  }
  .widget_action-deactived{
    width:10px;
    height:10px;
    background: #1296db;
    border-radius: 50%;
    padding:0;
    margin:0;
  }
  .widget_action:hover{
   /* border:1px solid #1296db; */
  }
  .widget_action::after{
    position: relative;
    content:'';
    top:-14px;
    right:-28px;
    z-index: 90011;
    display: block;
    width:10px;
    height: 2px;
    background: #ddd;
  }
  
  </style>