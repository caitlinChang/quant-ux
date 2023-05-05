<template>
  <div>
    <!-- <typography-title :children="title" /> -->
    <antd-input v-model="title" :placeholder="'请输入'" />
  </div>
</template>

<script>
// import VueWrapper from "./vueWrapper.js";
import { Input } from "antd";

export default {
  name:"ReactCompon ent",
  components: {
    // 'typography-title': Typography.Title,
    'antd-input':Input
  },
  setup() {
    return {
      title:'这是啥'
    }
   
  },
};
</script>
