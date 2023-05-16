<template>
  <div>
    <div v-for="item in componentInfo" :key="item.name">
      <div class="antd4-warpper" @click="(e) => $emit('onclick', item, e)">
        <component :is="item.component" v-bind="item.props" />
        <span>{{item.displayName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import componentInfo from "./componentList.js";
import componentList from "./util/constant";


export default {
  name: "ReactComponent",
  components: {
    ...componentList,
  },
  props: {
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      componentInfo,
    };
  },
  methods:{
    
  },
  mounted() {
  },
};
</script>

<style scoped>
.antd4-warpper {
  border: 1px solid #f5f5f5;
  padding: 10px;
  /* background-color: #f5f5f5; */
  cursor: pointer;
  width: 400px;
  /* height: 60px; */
}
.antd4-warpper:hover {
  border: 1px solid red;
}

</style>
