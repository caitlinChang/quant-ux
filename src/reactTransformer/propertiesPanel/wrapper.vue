<template>
    <div>
        <component :is="EditPanel" v-bind="panelProps" />
    </div>
</template>

<script>
import EditPanel from './panel';
export default {
    name: "VueWrapper",
    props: [],
    components: {
        EditPanel
    },
    data() {
        return {
            panelProps: {}
        }
    },
    methods: {
        
    }
}
</script>
