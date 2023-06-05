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
          v-decorator="[item.name, item.decorator]"
          v-bind="item.renderConfig.props"
          @change="(e) => handleChange(item.name, e)"
          @blur="(e) => handleBlur(item.name, e)"
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
    // 根据 name 从服务端那组件解析的 props
    resolveComponentProps(name) {
      const { props } = this.componentProps.default[0];
      const list = Object.values(props);
      this.propsList = list
        .map((item) => getTSType(item))
        .filter((item) => item?.renderConfig);
    },
    handleBlur(key, e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        // TODO: 看看能够替换 dojo 中 事件机制
        eventBus.emit(`${this.selectedId}:updateProps`, {
          [key]: e.target.value,
        });
        // 通知 model 更新
        this.$emit("setComponentProps", key, e.target.value);
      }
    },
    handleChange(key, e) {
      if (this.selectedId) {
        // 通知 画布上的组件更新
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
          return;
        }
        const value = e?.target?.value || e;
        // TODO: 看看能够替换 dojo 中 事件机制
        eventBus.emit(`${this.selectedId}:updateProps`, {
          [key]: value,
        });
        // 通知 model 更新
        this.$emit("setComponentProps", key, value);
      } else {
        console.error("现在没有被选中的组件");
      }
    },
    onSetWidgetProperties(widget) {
      this.selectedWidget = widget;
      this.selectedId = widget.id;
      this.resolveComponentProps(widget.component);
      setTimeout(() => {
        const { props } = widget;
        this.form.setFieldsValue({ ...props });
      });
    },
  },
};
</script>

<style scoped>
.properties-warpper {
  margin: 10px;
}
</style>
