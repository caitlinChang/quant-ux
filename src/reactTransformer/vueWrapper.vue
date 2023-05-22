<template>
  <div class="custom-widget-warpper">
      <component :is="componentInfo.component"  v-bind="componentInfo.props" @click="handleCaptureClick" />
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
  methods: {
    handleCaptureClick(e){
      // this.$emit('onclick', this.componentInfo, e)
      console.log('handleCaptureClick', e)
    }
  },
  mounted(){
  }
};
</script>


