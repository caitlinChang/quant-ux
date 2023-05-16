<template>
  <div class="custom-widget-warpper">
      <component :is="componentInfo.component"  v-bind="componentInfo.props" />
  </div>
</template>

<script>
import componentList from './util/constant'

export default {
  name: "VueWrapper",
  components:{
   ...componentList
  },
  props: ['componentInfo'],
  mounted(){
  }
};
</script>


