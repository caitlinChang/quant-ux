<template>
  <div class="custom-widget-warpper">
    <component :is="componentInfo.component" v-bind="componentProps">
      <template v-if="childrenList.length >= 1" v-slot:default>
        <template v-for="(c,index) in childrenList">
          <slot-wrapper v-if="c.type === 'text'" :props="c.widgetProps" :key="index"/>
          <children-wrapper :rootWidgetId="componentInfo.id" :path="`children.${index}`" v-if="c.type === 'component'" :key="index" :componentInfo="c.componentInfo" @selectWidgetChildren="(c, path) => handleSelectChildren(c, path ? `children.${index}.${path}` : `children.${index}`)" />
        </template>
      </template>
    </component>
  </div>
</template>

<script>
import eventBus from "./eventBus";
import componentList from "./util/constant";
import iconMap from './util/icon';
import { requestComponentProps} from './util/request'
import { setSlotWrapper, SlotWrapper } from "./slots/SlotWrapper";
import { getFieldNames } from './util/getFieldNames';
import { getMockedProps } from './util/mock';
import { clone, get } from 'lodash';
import { formatPath } from './util/common';
import ChildrenWrapper from './slots/ChildrenWrapper.vue';
import { handleChildren } from './util/childrenUtils';
export default {
  name: "VueWrapper",
  components: {
    ...componentList,
    ...iconMap,
    slotWrapper: SlotWrapper,
    ChildrenWrapper,
  },
  props: ["componentInfo"],
  data() {
    return {
      value: undefined,
      controlledNames: null,
      selectedId: "",
      componentProps: {}, // 经过 handleProps处理过后的，真正的传给组件的参数
      rawProps:{}, // 原始的 props， 在model中存储的props数据模型
      propsConfig: {}, // props的类型配置信息
      showAction: true,
      childrenList:[]
    };
  },
  methods: {
    handleSelectChildren(componentInfo, path) {
      // 选中一个 Children 时，设置该 children 的
      eventBus.emit(`selectWidgetChild`, {
        ...componentInfo,
        path
      });
    },
    onChange(value) { 
      let _value = value;
      if (this.controlledNames.valuePath) {
        _value = value[this.controlledNames.valuePath]
      }
      this.value = _value;
      // 更新props
      
    },
    async resolveComponentProps(name, id) {
      const res = await requestComponentProps(name);
      this.propsConfig = res.props;
      let newProps = {};
      this.rawProps = clone(this.componentInfo.props);
      if (this.rawProps && Object.keys(this.rawProps).length) {
        newProps = clone(this.rawProps);
      } else {
        this.rawProps = getMockedProps(res.props);
        newProps = clone(this.rawProps);
        //TODO: 因为 组件是先添加再被选中的，所以这个里的事件触发
        // 会比 panel 中的事件注册更早，所以这里要用setTimeout 
        setTimeout(() => {
          Object.keys(this.rawProps).forEach(i => {
            //mock 的数据也需要更新到 model 中
            eventBus.emit(`${id}:canvasUpdate`,i, this.rawProps[i])
          })
        })
      }
      // 对原始的props 做层slotWrapper 方便画布操作
      const _props = this.handleProps(newProps);
      this.componentProps = _props;
    },
    /**
     * 递归获取组件每一个层级的props
     * @param {*} config 
     * @param {*} path 
     * @param {*} rawProps 
     * @param {*} fieldNames 
     */
    getWrapperProps(config, path, rawProps, fieldNames) {
      const curValue = get(rawProps, path);
      if (!config) {
        console.log(`${path} 的 config 值为 undefined`)
        return;
      }
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
        obj[propsName] = this.getWrapperProps(config, propsName, cloneProps);
      });
      const { children, ...restProps } = obj;
      if (!children) {
        this.childrenProps = null;
      } else {
        this.setChildrenList(children)
      }
     
      return restProps;
    },    

    setChildrenList(childrenProps) {
      const { children, ...rest } = childrenProps;
      this.childrenList = handleChildren(children, rest);
    }
  },
  mounted() {
    if (this.componentInfo.id) {
      this.resolveComponentProps(this.componentInfo.component, this.componentInfo.id);
      // 监听属性面板的更新
      eventBus.on(`${this.componentInfo.id}:propsUpdate`, (props) => {
        const newProps = clone({ ...this.rawProps, ...props });
        const _props = this.handleProps(newProps);
        this.componentProps = _props;
      });

    }
  },
  unmounted() {
    const { id } = this.componentInfo;
    if (this.componentInfo.id) {
      eventBus.off(`${id}:propsUpdate`);
    }
  },
};
</script>

<style scoped>
.custom-widget-warpper{
  position: relative;
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