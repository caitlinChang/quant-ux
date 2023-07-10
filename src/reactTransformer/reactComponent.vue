<template>
  <div class="wrapper">
    <ul class="sidebar">
      <li v-for="item in categoryList" :key="item.key" @click="type = item.key" :class="{'sidebar-active': type === item.key}">{{item.label}}</li>
    </ul>
    <div v-show="type === 'antd4'" class="widgets-list">
      <h1>常用</h1>
      <div class="custome-widget-wrapper">
        <div v-for="item in componentList" :key="item.name">
          <div
            class="antd4-warpper"
            @click="(e) => $emit('onclick', { ...item }, e)"
          >
            <!-- <div>
              <component :is="item.component" v-bind="{ ...item.props }" />
            </div> -->
            <span class="display-desc">{{ item.description }}</span>
            <span class="display-name">{{ item.displayName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-show="type === 'Icon'" class="widgets-list">
      <h1>Icon</h1>
      <div class="custome-widget-wrapper">
        <div v-for="item in iconList" :key="item.name">
          <div
            class="antd4-icon-warpper"
            @click="(e) => $emit('onclick', { ...item }, e)"
          >
            <div>
              <component :is="item.component" v-bind="{ ...iconProps }" />
            </div>
            <!-- <span class="display-name">{{ item.displayName }}</span> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import componentList from "./componentList.js";
import componentMap from "./util/constant";
import iconMap, { iconList } from "./util/icon";

export default {
  name: "ReactComponent",
  components: {
    ...componentMap,
    ...iconMap,
  },
  props: {
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      componentList,
      iconList,
      type: "antd4",
      categoryList: [
        {
          label: 'Common',
          key:'common'
        },
        {
          label: 'Ant Design',
          key:'antd4'
        },
        {
          label: 'Layout',
          key:'Layout'
        },
        {
          label: 'Formula',
          key:'formula'
        },
        {
          label: 'Icon',
          key:'Icon'
        }
      ],
      iconProps: {
        style: {
          fontSize: '18px',
          margin:'6px'
        }
      }
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.wrapper {
  display: flex;
}
.sidebar {
  position: absolute;
}
.sidebar-active {
  color:#3787f2;
}
.widgets-list {
  flex: 1;
  margin-left: 120px;
}
.custome-widget-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
  /* background-color: #f5f5f5; */
}
.antd4-warpper {
  padding: 10px;
  margin: 10px;
  background-color: #f5f5f5;
  cursor: pointer;
  width: 160px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}
.antd4-warpper:hover {
  border: 1px solid blue;
}

.display-name {
  display: block;
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  justify-self: end;
  width: 100%;
  position: absolute;
  bottom: 5px;
}
.display-desc {
  display: block;
  text-align: center;
  font-size: 16px;
  color: #555;
}
.antd4-icon-warpper {
  margin: 10px;
  background-color: #f5f5f5;
  cursor: pointer;
  width: 30px;
  height:30px;
  box-sizing: border-box;
}
</style>
