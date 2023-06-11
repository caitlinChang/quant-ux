<template>
  <div>
    <h1>常用</h1>
    <div class="custome-widget-wrapper">
      <div v-for="item in componentList" :key="item.name">
        <div
          class="antd4-warpper"
          @click="(e) => $emit('onclick', { ...item }, e)"
        >
          <div>
            <component :is="item.component" v-bind="{ ...item.props }" />
          </div>
          <span class="display-name">{{ item.displayName }}</span>
        </div>
      </div>
    </div>
    <h1>布局</h1>
    <h1>Formula</h1>
    <h1>Icon</h1>
  </div>
</template>

<script>
import componentList from "./componentList.js";
import componentMap from "./util/constant";
import iconMap from "./util/icon";

export default {
  name: "ReactComponent",
  components: {
    ...componentMap,
    ...iconMap,
  },
  props: {
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      componentList,
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.custome-widget-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
  /* background-color: #f5f5f5; */
}
.antd4-warpper {
  padding: 10px;
  margin: 10px;
  background-color: #f5f5f5;
  cursor: pointer;
  width: 160px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}
.antd4-warpper:hover {
  border: 1px solid blue;
}

.display-name {
  display: block;
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  justify-self: end;
  width: 100%;
  position: absolute;
  bottom: 5px;
}
</style>
