<template>
  <div class="custom-widget-warpper">
    <component :is="componentInfo.component" v-bind="componentProps" />
  </div>
</template>

<script>
import eventBus from "./eventBus";
import componentList from "./util/constant";
import { getPropType, getNestedPropType } from "./util";

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
    };
  },
  methods: {
    //处理组件的 props，如果某个props类型是 ReactNode, 要包裹上一层元素，用于处理数据同步
    handleProps(props) {
      Object.keys(props).forEach((propsName) => {
        const info = getPropType(propsName, this.componentInfo.component);
        if (info.type === "ReactNode") {
          props[propsName] = (
            <div class="can-edit-wrapper">{props[propsName]}</div>
          );
        } else if (info.type === "array") {
          // 检查 array 中每一项的类型
          const itemTypeList = getNestedPropType(info.type, info.properties);
          console.log("itemTypeList = ", itemTypeList);
          if (itemTypeList?.length) {
            props[propsName] = props[propsName].map((item) => {
              const obj = { ...item };
              for (let key in item) {
                if (itemTypeList.includes(key)) {
                  obj[key] = <div class="can-edit-wrapper">{item[key]}</div>;
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
    const { id, props } = this.componentInfo;
    if (this.componentInfo.id) {
      this.handleProps(props);
      this.componentProps = props;
      console.log("initialProps = ", this.componentProps);
      eventBus.on(`${id}:updateProps`, (props) => {
        const newProps = { ...this.componentProps, ...props };
        this.handleProps(newProps);
        this.componentProps = newProps;
        console.log("更新 = ", newProps);
      });
    }
  },
  unmounted() {
    const { id } = this.componentInfo;
    if (this.componentInfo.id) {
      eventBus.off(`${id}:updateProps`);
    }
  },
};
</script>
