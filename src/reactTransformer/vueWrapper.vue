<template>
  <div class="custom-widget-warpper">
    <!-- <div v-if="showAction" class="widget_action">
      <img class="widget_action-item widget_action-add" src="./static/imgs/child_branch.png" />
      <img class="widget_action-actived widget_action-add" src="./static/imgs/same_level_branch.png" />
      <div class="widget_action-deactived"></div>
    </div> -->
    <component :is="componentInfo.component" v-bind="componentProps" />
  </div>
</template>

<script>
import eventBus from "./eventBus";
import componentList from "./util/constant";
import iconMap from './util/icon';
import {
  getPropType,
  getNestedPropType,
} from "./util/propsValueUtils";
import { requestComponentProps} from './util/request'
import { setSlotWrapper } from "./slots/SlotWrapper";
import { getFieldNames } from './util/getFieldNames';
import { findControlledProps } from './util/common';
import { getMockData } from './util/mock'

export default {
  name: "VueWrapper",
  components: {
    ...componentList,
    ...iconMap
  },
  props: ["componentInfo"],
  data() {
    return {
      value: undefined,
      controlledNames: null,
      selectedId: "",
      componentProps: {},
      propsConfig: {},
      showAction: true,
    };
  },
  methods: {
    onChange(value) { 
      let _value = value;
      if (this.controlledNames.valuePath) {
        _value = value[this.controlledNames.valuePath]
      }
      this.value = _value;
      // 更新props
      eventBus.emit(`canvasEdit`, this.controlledNames.value,_value,false);
    },
    async resolveComponentProps(name, id) {
      const res = await requestComponentProps(name);
      this.propsConfig = res.props;
      let newProps = {};
      if (this.componentInfo.props && Object.keys(this.componentInfo.props).length) {
        newProps = JSON.parse(JSON.stringify(this.componentInfo.props));
      } else {
        newProps = this.setMockDataForProps(res.props);
        eventBus.emit('canvasEdit', '', {...newProps}, false)
      }

      // 对原始的props 做层slotWrapper 方便画布操作
      this.handleProps(newProps);
      const controlledNames = findControlledProps(this.propsConfig);
      if (controlledNames) {
        this.controlledNames = controlledNames;
        newProps = {
          ...newProps,
          [controlledNames.value]: newProps[controlledNames.value] || this.value,
          [controlledNames.onChange]: this.onChange,
        }
      }
      this.componentProps = newProps;
    },
    //处理组件的 props，如果某个props类型是 ReactNode, 要包裹上一层元素，用于处理数据同步
    handleProps(props) {
      Object.keys(props).forEach((propsName) => {
        const info = getPropType(propsName, this.propsConfig);
        if (info.type === "ReactNode") {
          props[propsName] = setSlotWrapper({
            widgetId: this.componentInfo.id,
            widgetProps: { ...this.componentInfo.props },
            path: propsName,
            children: props[propsName],
            meta:[4]
          });
        } else if (info.type === "array") {
          // 检查 array 中每一项的类型
          const itemTypeList = getNestedPropType(info.type, info.properties);
          const fieldNames = getFieldNames(this.propsConfig[propsName]);
          if (itemTypeList?.length) {
            props[propsName] = props[propsName].map((item, index) => {
              const obj = { ...item };
              for (let key in item) {
                if (itemTypeList.includes(key)) {
                  obj[key] = setSlotWrapper({
                    children: item[key],
                    widgetId: this.componentInfo.id,
                    widgetProps:  { ...this.componentInfo.props },
                    path: `${propsName}[${index}].${key}`,
                    fieldNames,
                    meta:[0,2,4]
                  });
                }
              }
              return obj;
            });
          }
        }
      });
    },
    setMockDataForProps(propsConfig) { 
      const data = {};
      Object.entries(propsConfig).forEach(([key, item]) => {
        if (item.needMock) {
          data[key] = getMockData(propsConfig[key]);
        }
      });
      return data;
    },
    // 对受控组件的处理
    controlledComponent() {
      
    }
  },
  mounted() {
    if (this.componentInfo.id) {
      this.resolveComponentProps(this.componentInfo.component);

      eventBus.on(`${this.componentInfo.id}:updateProps`, (props) => {
        const newProps = { ...this.componentProps, ...props };
        this.handleProps(newProps);
        this.componentProps = newProps;
      });

    }
  },
  unmounted() {
    const { id } = this.componentInfo;
    if (this.componentInfo.id) {
      eventBus.off(`${id}:updateProps`);
      eventBus.off(`${this.componentInfo.id}:action`)
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