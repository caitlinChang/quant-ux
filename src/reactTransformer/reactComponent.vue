<template>
  <div class="antd4-warpper" @click="(e) => $emit('onclick', e)">
    <!-- <typography-title :children="title" /> -->
    <antd-input v-model="title" :placeholder="'请输入'" />
  </div>
</template>

<script>
// import VueWrapper from "./vueWrapper.js";
import { Input } from "antd";

export default {
  name: "ReactCompon ent",
  components: {
    // 'typography-title': Typography.Title,
    "antd-input": Input,
  },
  props: {
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  setup() {
    return {
      title: "这是啥",
    };
  },
};
</script>

<style scoped>
.antd4-warpper {
  border: 1px solid #f5f5f5;
  padding: 10px;
  background-color: #f5f5f5;
  cursor: pointer;
  width:200px;
  height:60px;
}
.antd4-warpper:hover {
  border: 1px solid red;
}
</style>
