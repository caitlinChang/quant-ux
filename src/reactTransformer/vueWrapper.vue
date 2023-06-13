<template>
  <div class="custom-widget-warpper">
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
          // props[propsName] = (
          //   <div class="can-edit-wrapper">{props[propsName]}</div>
          // );
        } else if (info.type === "array") {
          // 检查 array 中每一项的类型
          const itemTypeList = getNestedPropType(info.type, info.properties);
          if (itemTypeList?.length) {
            props[propsName] = props[propsName].map((item) => {
              const obj = { ...item };
              for (let key in item) {
                if (itemTypeList.includes(key)) {
                  obj[key] = setSlotWrapper(item[key]);
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
