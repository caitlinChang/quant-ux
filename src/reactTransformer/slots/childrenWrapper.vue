<template>
    <component :is="componentInfo.component" v-bind="componentProps" />
</template>

<script>
export default {
    name: "ChildrenWrapper",
    components: {
    },
    props: ["render"],
    data() {
        return {
           
        };
    },
    methods: {}
}
</script>