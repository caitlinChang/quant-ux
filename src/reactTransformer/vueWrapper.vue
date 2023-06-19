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
import {
  getPropType,
  getNestedPropType,
  requestComponentProps,
} from "./propertiesPanel/util";
import { setSlotWrapper } from "./slots/SlotWrapper";

export default {
  name: "VueWrapper",
  components: {
    ...componentList,
  },
  props: ["componentInfo"],
  data() {
    return {
      selectedId: "",
      componentProps: {},
      propsConfig: {},
      showAction:true
    };
  },
  methods: {
    async resolveComponentProps(name, id) {
      const res = await requestComponentProps(name);
      this.propsConfig = res.props;
      const newProps = JSON.parse(JSON.stringify(this.componentInfo.props));
      this.handleProps(newProps);
      this.componentProps = newProps;
    },
    //处理组件的 props，如果某个props类型是 ReactNode, 要包裹上一层元素，用于处理数据同步
    handleProps(props) {
      Object.keys(props).forEach((propsName) => {
        const info = getPropType(propsName, this.propsConfig);
        if (info.type === "ReactNode") {
          props[propsName] = setSlotWrapper(props[propsName], propsName, this.componentInfo.id);
        } else if (info.type === "array") {
          // 检查 array 中每一项的类型
          const itemTypeList = getNestedPropType(info.type, info.properties);
          if (itemTypeList?.length) {
            props[propsName] = props[propsName].map((item, index) => {
              const obj = { ...item };
              for (let key in item) {
                if (itemTypeList.includes(key)) {
                  obj[key] = setSlotWrapper(item[key],`${propsName}[${index}].${key}`, this.componentInfo.id);
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
      this.resolveComponentProps(this.componentInfo.component);

      eventBus.on(`${this.componentInfo.id}:updateProps`, (props) => {
        const newProps = { ...this.componentProps, ...props };
        this.handleProps(newProps);
        this.componentProps = newProps;
      });

      eventBus.on(`${this.componentInfo.id}:action`, (props) => {
        const { type, path } = props;
        // console.log(type, path);
      })
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