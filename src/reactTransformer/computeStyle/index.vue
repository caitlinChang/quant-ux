<template>
    <div id="compute-style">
        <div class="compute-style-item" :id="['computed-style',item.name].join('-')" v-for="item in antdList" :key="item.name">
            <vue-wrapper :componentInfo="item" />
        </div>
        
    </div>
</template>
<script>
import antdMap, { antdList } from "../util/getWidgets/antd";
import vueWrapper from "../slots/vueWrapper";

export default {
    components: {
        vueWrapper,
    },
    data() {
        return {
            antdList
        }
    },
    mounted() {
        // 计算高度
        setTimeout(() => {
            antdList.forEach(item => { 
                const element = document.getElementById(['computed-style', item.name].join('-')).firstChild.firstChild;
                if (element) {
                    const height = element.clientHeight;
                    const width = element.clientWidth;
                    if(item.name === 'antd-menu'){
                        console.log('antd-menu = ', height, width, item.w, item.h)
                        console.log('element = ', element)
                    }
                    if (!item.w) {
                        item.w = width ? width : 60;
                    }
                    if (!item.h) {
                        item.h = height ? height : 60;
                    }
                    
                } else {
                    item.w = 60;
                    item.h = 60;
                }
            });
            document.removeChild(document.getElementById('compute-style'));
        })
    }
}
</script>

<style scoped>
#compute-style{
    /* display: flex; */
    visibility: hidden;
}
.compute-style-item{
    display: inline-block;
    position: absolute;
    visibility:hidden;
    z-index:-999;
}

</style>
