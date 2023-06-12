<template>
  <div class="slot-can-edit-warpper">
    <slot />
  </div>
</template>

<script>
export default {
  name: "SlotWrapper",
  components: {},
  props: ["componentInfo"],
  data() {
    return {};
  },
};
</script>
