<template>
  <div class="custom-widget-warpper">
    <component :is="componentInfo.component" v-bind="componentProps" />
  </div>
</template>

<script>
import eventBus from "./eventBus";
import componentList from "./util/constant";

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
  methods: {},
  mounted() {
    const { id, props } = this.componentInfo;
    if (this.componentInfo.id) {
      this.componentProps = props;
      eventBus.on(`${id}:updateProps`, (props) => {
        this.componentProps = { ...this.componentProps, ...props };
        console.log("更新 = ", this.componentProps);
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
