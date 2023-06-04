<template>
  <div class="properties-warpper">
    <div v-for="item in propsList" :key="item.name">
      <div class="properties-item-warpper">
        <span class="properties-item-title">{{ item.description }}:</span>
        <component :is="PropertiesForm" />
      </div>
    </div>
  </div>
</template>

<script>
import * as componentProps from "../props/input.json";
import { getTSType } from "./util.js";
import PropertiesForm from "../propertiesPanel/form";
export default {
  name: "PropertiesWrapper",
  components: {
    PropertiesForm,
  },
  props: [],
  data() {
    return {
      componentProps,
      propsList: [],
    };
  },
  methods: {
    resolveComponentProps() {
      const { props } = this.componentProps.default[0];
      const list = Object.values(props);
      this.propsList = list
        .map((item) => getTSType(item))
        .filter((item) => item?.renderConfig);
    },
  },
  mounted() {
    this.resolveComponentProps();
  },
};
</script>

<style scoped>
.properties-item-warpper {
  display: flex;
  align-items: center;
  margin: 5px;
}
.properties-item-title {
  display: inline-block;
  margin-right: 5px;
  font-size: 16px;
}
</style>
