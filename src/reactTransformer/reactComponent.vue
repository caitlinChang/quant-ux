<template>
  <div>
    <div v-for="item in componentInfo" :key="item.name">
      <div class="antd4-warpper"  @click="(e) => $emit('onclick', item, e)">
        <component :is="item.component" :placeholder="'请输入'" />
      </div>
    </div>
  </div>
  
</template>

<script>
import componentInfo from './reactComponent.json';
import { componentList } from './util/constant'

export default {
  name: "ReactComponent",
  components: {
    ...componentList
  },
  props: {
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  data(){
    return {
      componentInfo
    }
  },
  mounted(){
    // console.log(this.componentInfo)
  }
}
</script>
