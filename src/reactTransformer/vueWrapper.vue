<template>
  <div class="antd4-warpper" @click="(e) => $emit('onclick', e)">
    <slot></slot>
  </div>
</template>

<script>
import { Input, Typography } from "antd";

export default {
  name: "VueWrapper",
  props: {
    onClick: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
