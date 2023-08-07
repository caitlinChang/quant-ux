<template>
    <div :class="['child-widget-warpper',{'child-widget-warpper_active': isActive === path }]" @dblclick="handleDblClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <component :is="componentInfo.component" v-bind="componentProps">
        <template v-if="(childrenList || []).length >= 1" v-slot:default>
          <template v-for="(c,index) in childrenList">
            <slot-wrapper 
              v-if="c.type === 'text'" 
              :path="`${path}`" 
              :props="c.widgetProps"
              :rootWidgetId="rootWidgetId"
              :key="index"
              @dblclick="preventDblClick"  
            />
            <children-wrapper 
              v-if="c.type === 'component'"
              :isMouseenter="isMouseenter" 
              :isActive="isActive" 
              :rootWidgetId="rootWidgetId" 
              :path="`${path}[1].children[${index}]`"  
              :key="index" 
              :componentInfo="c.componentInfo" 
              @handleMouseEnter="(path) => $emit('handleMouseEnter', path)" 
              @handleMouseLeave="(path) => $emit('handleMouseLeave', path)" 
              @selectWidgetChildren="(c, path) => $emit('selectWidgetChildren',c, path ? `children[${index}][1].${path}` : `children[${index}]`)" />
          </template>
        </template>
      </component>
    </div>
  </template>
  
  <script>
  import antdMap from "../util/getWidgets/antd";
  import iconMap from '../util/getWidgets/icon';
  import { SlotWrapper } from "./SlotWrapper";
  import { cloneDeep } from 'lodash';
  import { getRenderedProps } from './util';

  export default {
    name: "ChildrenWrapper",
    components: {
      ...antdMap,
      ...iconMap,
      slotWrapper: SlotWrapper,
    },
    props: ["componentInfo", "rootWidgetId", "path", "isActive", "isMouseenter"],
    data() {
      return {
        value: undefined, // 受控组件，暂时弃用
        controlledNames: null,// 受控组件，暂时弃用
        componentProps: {}, // 经过 handleProps处理过后的，真正的传给组件的参数
        rawProps:{}, // 原始的 props， 在model中存储的props数据模型
        childrenList: [],
      };
    },
    watch: {
      componentInfo: {
        immediate: true,
        handler() {
          if (!this.componentInfo.component) {
            return;
          }
          const { component, props, category } = this.componentInfo;
          this.resolveComponentProps(category === 'ICON' ? 'icon' : component, props, this.rootWidgetId, this.path);
        }
      }    
    },
    methods: {
      handleMouseEnter(e) { 
        e.stopPropagation();
        if (this.isMouseenter === this.path) {
          return;
        }
        // this.$emit("handleMouseEnter", this.path)
      },
      handleMouseLeave(e) {
        e.stopPropagation();
        if (this.isMouseenter !== this.path) {
          return;
        }
        // this.$emit("handleMouseLeave", this.path)
      },
      preventDblClick(e) {
        // 阻止触发 selectWidgetChildren 事件
      },
      handleDblClick(e) {
        if (e.target.classList.contains("can-edit")) {
              return;
        }
        e.stopPropagation();
        this.$emit('selectWidgetChildren', {
          ...this.componentInfo,
          props: cloneDeep(this.rawProps)
        }, '')
      },
      async resolveComponentProps(name, props) {
        this.rawProps = cloneDeep(props);
        const res = getRenderedProps(name, props);
        const { children, restProps } = res;
        this.childrenList = children;
        this.componentProps = restProps;
      },
    },
  };
  </script>
  
  <style scoped>
  .child-widget-warpper{
    position: relative;
  }
  .child-widget-warpper_active {
    border:1px dashed #9b5de5;
  }
  /* .child-widget-warpper_enter{
    border:1px solid #8093f1;
  } */

  .child-widget-warpper:not(.child-widget-warpper_active):hover{
    border:1px solid #8093f1;
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