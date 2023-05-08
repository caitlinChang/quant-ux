<template>
  <div class="custom-widget-warpper">
    <component :is="componentInfo.component" />
  </div>
</template>

<script>
import { componentList } from './util/constant'

export default {
  name: "VueWrapper",
  components:{
   ...componentList
  },
  props: {
    componentInfo: {
      type: Object,
      default: () => {
        return {
          "_type":"antd4",
          "type":"antd4",
          "w":200,
          "h":60,
          "name":"Typography.Text.1",
          "component":"typography-text",
          "props":{
            "type":"secondary",
            "children":"这里是一个test"
          }
        }
      },
    },
  },
};
</script>
