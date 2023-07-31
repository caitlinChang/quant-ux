<template>
  <div class="custom-widget-warpper">
    <component :is="componentInfo.component" v-bind="componentProps">
      <template v-if="(childrenList || []).length >= 1" v-slot:default>
        <template v-for="(c,index) in childrenList">
          <slot-wrapper v-if="c.type === 'text'" path="children" :props="c.widgetProps" :key="index"/>
          <children-wrapper 
            v-if="c.type === 'component'" :key="index"
            :isMouseenter="isMouseenter" 
            :isActive="isActive" 
            :rootWidgetId="componentInfo.id" 
            :path="`children[${index}]`"  
            :componentInfo="c.componentInfo" 
            @handleMouseEnter="handleMouseEnter" 
            @handleMouseLeave="handleMouseLeave" 
            @selectWidgetChildren="(c, path) => handleSelectChildren(c, path ? `children[${index}][1].${path}` : `children[${index}]`)" />
        </template>
      </template>
    </component>
  </div>
</template>

<script>
import eventBus from "../eventBus";
import antdMap from "../util/getWidgets/antd";
import iconMap from '../util/getWidgets/icon';
import { SlotWrapper } from "./SlotWrapper";
import { cloneDeep } from 'lodash';
import ChildrenWrapper from './ChildrenWrapper.vue';
import { transferPath } from '../util/propsValueUtils';
import { getRenderedProps } from './util';
export default {
  name: "VueWrapper",
  components: {
    ...antdMap,
    ...iconMap,
    slotWrapper: SlotWrapper,
    ChildrenWrapper,
  },
  props: ["componentInfo"],
  data() {
    return {
      value: undefined, // 受控组件，暂时弃用
      controlledNames: null,// 受控组件，暂时弃用
      componentProps: {}, // 经过 getRenderedProps 处理过后的，真正的传给组件的参数
      rawProps:{}, // 原始的 props， 在model中存储的props数据模型
      childrenList: [],
      isActive: '',
      isMouseenter:'',
    };
  },
  methods: {
    handleMouseEnter(path) {
      this.isMouseenter = path;  
      console.log(' this.isMouseenter = ', this.isMouseenter)
    },
    handleMouseLeave(path) {
      // this.isMouseenter = '';  
    },
    /**
     * 选中子组件
     * @param {*} componentInfo 
     * @param {*} path 
     */
    handleSelectChildren(componentInfo, path) {
      // TODO: 如何取消选中
      this.isActive = path;
      eventBus.emit(`selectWidgetChild`, {
        ...componentInfo,
        path
      });
    },
    async resolveComponentProps(name, props) {
      this.rawProps = cloneDeep(props);
      const res = getRenderedProps(name, props, this.componentInfo.id, '');
      const { children, restProps } = res;
      this.childrenList = children;
      this.componentProps = restProps;
    },
  },
  mounted() {
    const { component, props, id } = this.componentInfo;
    this.resolveComponentProps(component, props);
    if (id) {
      // 监听属性面板的更新
      eventBus.on(`${this.componentInfo.id}:propsUpdate`, (props, path) => {
        // TODO: 待优化，不需要区分是否有 path
        if (path) {
          // 子组件的 inlineEdit 
          const { newFormData } = transferPath(path, props, this.rawProps)
          const newProps = cloneDeep(newFormData);
          const res = getRenderedProps(component, newProps, id, '');
          const { children, restProps } = res;
          this.childrenList = children;
          this.componentProps = restProps;
      
        } else {
          const newProps = cloneDeep({ ...this.rawProps, ...props });
          const res = getRenderedProps(component, newProps, id, '');
          const { children, restProps } = res;
          this.childrenList = children;
          this.componentProps = restProps;
        }
       
      });
      // 属性面板按照路径选择组件
      eventBus.on('reverseElectionChild', (child, path) => {
        this.handleSelectChildren({
          ...child
        }, path)
      })
      // TODO: 需要优化，不需要这么多的事件
      // 取消选中时
      eventBus.on(`${this.componentInfo.id}:deSelected`, () => {
        this.isActive = false;
        this.isMouseenter = false;
      })
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