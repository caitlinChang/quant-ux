<template>
  <div class="custom-widget-warpper">
    <component :is="componentInfo.component" v-bind="componentProps" />
  </div>
</template>

<script>
import eventBus from "./eventBus";
import componentList from "./util/constant";
import iconMap from './util/icon';
import { requestComponentProps} from './util/request'
import { setSlotWrapper } from "./slots/SlotWrapper";
import { getFieldNames } from './util/getFieldNames';
import { findControlledProps } from './util/common';
import { getMockedProps } from './util/mock';
import { clone } from 'lodash';

export default {
  name: "VueWrapper",
  components: {
    ...componentList,
    ...iconMap,
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
      this.rawProps = this.componentInfo.props;
      if (this.rawProps && Object.keys(this.rawProps).length) {
        newProps = clone(this.rawProps);
      } else {
        this.rawProps = getMockedProps(res.props);
        newProps = clone(this.rawProps);
        // mock 的数据也需要更新到 model 中
        setTimeout(() => {
          Object.keys(this.rawProps).forEach(i => {
            console.log('触发了吗 ===', `${id}:canvasUpdate`)
            eventBus.emit(`${id}:canvasUpdate`,i, this.rawProps[i])
          })
        })
      }

      // 对原始的props 做层slotWrapper 方便画布操作
      this.handleProps(newProps);
      this.componentProps = newProps;
    },
    //处理组件的 props，如果某个props类型是 ReactNode, 要包裹上一层元素，用于处理数据同步
    handleProps(props) {
      const cloneProps = clone(props);
      Object.keys(props).forEach((propsName) => {
        const info = this.propsConfig[propsName]; //getPropType(propsName, this.propsConfig);
        const { type: { name, item } } = info;
        if (name === "ReactNode") {
          props[propsName] = setSlotWrapper({
            widgetId: this.componentInfo.id,
            widgetProps: { ...cloneProps },
            path: propsName,
            children: props[propsName],
            meta:[4]
          });
        } else if (name === "array") {
          // 检查 array 中每一项的类型
          const itemTypeList = Object.keys(item).filter(i => item[i].type.name === 'ReactNode')
          console.log('itemTypeList = ', itemTypeList)
          const fieldNames = getFieldNames(this.propsConfig[propsName]);
          if (itemTypeList?.length) {
            props[propsName] = props[propsName].map((item, index) => {
              const obj = { ...item };
              for (let key in item) {
                if (itemTypeList.includes(key)) {
                  obj[key] = setSlotWrapper({
                    children: item[key],
                    widgetId: this.componentInfo.id,
                    widgetProps:  { ...cloneProps },
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
    
  },
  mounted() {
    if (this.componentInfo.id) {
      this.resolveComponentProps(this.componentInfo.component, this.componentInfo.id);
      // 监听属性面板的更新
      eventBus.on(`${this.componentInfo.id}:propsUpdate`, (props) => {
        const newProps = clone({ ...this.rawProps, ...props });
        this.handleProps(newProps);
        this.componentProps = newProps;
      });

    }
  },
  unmounted() {
    const { id } = this.componentInfo;
    if (this.componentInfo.id) {
      eventBus.off(`${id}:propsUpdate`);
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