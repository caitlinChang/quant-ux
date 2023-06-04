<template>
  <div id="properties-warpper" class="properties-warpper">
    <a-form :form="form" layout="vertical" autocomplete="off">
      <a-form-item
        v-for="item in propsList"
        :key="item.name"
        :label="item.description"
      >
        <component
          :is="item.renderConfig.component"
          v-decorator="[item.name]"
          v-bind="item.renderConfig.props"
          @change="(e) => handleChange(item.name, e)"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import eventBus from "../eventBus";
import * as componentProps from "../props/input.json";
import { getTSType } from "./util.js";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

export default {
  name: "PropertiesWrapper",
  components: {},
  data() {
    return {
      componentProps,
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this, { name: "coordinated" }),
      propsList: [],
      getPopupContainer: () => document.getElementById("properties-warpper"),
    };
  },
  methods: {
    resolveComponentProps() {
      const { props } = this.componentProps.default[0];
      const list = Object.values(props);
      this.propsList = list
        .map((item) => getTSType(item))
        .filter((item) => item?.renderConfig);
    },
    handleChange(key, e) {
      if (this.selectedId) {
        eventBus.emit(`${this.selectedId}:updateProps`, {
          [key]: e.target.value,
        });
      } else {
        console.error("现在没有被选中的组件");
      }
    },
    onSetWidgetProperties(widget) {
      this.selectedWidget = widget;
      this.selectedId = widget.id;
    },
  },
  mounted() {
    this.resolveComponentProps();
  },
};
</script>

<style scoped>
.properties-warpper {
  margin: 10px;
}
</style>
