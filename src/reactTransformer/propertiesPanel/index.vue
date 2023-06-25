<template>
  <div id="properties-warpper" class="properties-warpper">
    <a-form-model
      v-if="selectedId"
      layout="inline"
      :model="formData"
      autocomplete="off"
      size="small"
    >
      <a-page-header style="padding: 5px 0" title="属性面板" />
      <div v-for="item in propsList" :key="item.name">
        <a-form-model-item
          v-if="!item.renderConfig.type"
          :key="item.name"
          :label="item.description"
          style="margin: 0; padding: 0"
        >
          <component
            :is="item.renderConfig.component"
            v-bind="item.renderConfig.props"
            v-model="formData[item.name]"
            @change="(e) => handleChange(item.name, e)"
            @blur="(e) => handleBlur(item.name, e)"
          />
        </a-form-model-item>
        <!-- 处理动态自增选项-->
        <a-card
          class="properties-warpper-card"
          v-else
          size="small"
          :title="item.description || '选项'"
        >
          <a-icon slot="extra" type="plus" @click="() => add(item.name)" />
          <a-form-model-item
            v-for="(k, index) in formData[item.name] || []"
            :key="index"
            style="margin: 4px 0; padding: 0; width: 100%"
          >
            <a-input
              v-model="k[item.renderConfig.fieldNames.label]"
              style="width: 90%; margin-right: 8px"
              @blur="
                (e) =>
                  handleChangeItem(
                    item.name,
                    index,
                    e,
                    item.renderConfig.fieldNames
                  )
              "
            />
            <a-icon
              v-if="index >= 1"
              class="dynamic-delete-button"
              type="minus"
              @click="() => remove(item.name, index)"
            />
          </a-form-model-item>
        </a-card>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import eventBus from "../eventBus";
import * as componentProps from "../props/input.json";
import { requestComponentProps } from '../util/request';
import { getFirstKey } from '../util/propsValueUtils'
import { getTSType } from "../util/resolvePropsConfig";
import { set } from "lodash";

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
      selectedId: "",
      formData: {},
      propsList: [],
      getPopupContainer: () => document.getElementById("properties-warpper"),
    };
  },
  methods: {
    // 根据 name 从服务端那组件解析的 props
    async resolveComponentProps(name) {
      const res = await requestComponentProps(name);
      const { props } = res;
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
        if (
          e?.target?.tagName === "INPUT" ||
          e?.target?.tagName === "TEXTAREA"
        ) {
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
    handleChangeItem(name, index, e, fieldNames) {
      const value = {
        [fieldNames.label]: e.target.value,
        [fieldNames.value]: index,
      };
      const oldValue = this.formData[name];
      oldValue.splice(index, 1, value);
      eventBus.emit(`${this.selectedId}:updateProps`, {
        [name]: oldValue,
      });
      // 通知 model 更新
      this.$emit("setComponentProps", name, oldValue);
    },
    remove(name, index) {
      this.formData[name].splice(index, 1);
    },
    add(name) {
      this.formData[name].push({});
    },
    onSetWidgetProperties(widget) {
      this.selectedWidget = widget;
      this.selectedId = widget.id;
      this.resolveComponentProps(widget.component);
      setTimeout(() => {
        const { props } = widget;
        // TODO: 这一段逻辑与 mock 后setFormData的逻辑要优化
        if (Object.keys(props).length) {
          this.formData = JSON.parse(JSON.stringify(props));
        }
      });
    },
    clearPropertiesPanel() {
      this.selectedWidget = null;
      this.selectedId = "";
      this.propsList = [];
      this.formData = {};
    },
  },
  mounted() {
    eventBus.on("canvasEdit", (path, value, updateCanvas) => {
      
      // 通知 model 更新
      if (!path) {
        // 传入的不是props中的某个字段，而是整个props
        setTimeout(() => {
          this.formData = {...value};
        })
        Object.keys(value).forEach((key) => {
          this.$emit("setComponentProps", key, value[key]);
        })
        return;
      }
      const key = getFirstKey(path);
      const newValue = set(this.formData, path, value);
      
      if (updateCanvas) {
        // 通过contextMenu 修改的值，需要通过 eventBus 通知组件更新
        eventBus.emit(`${this.selectedId}:updateProps`, {
          [key]: newValue[key],
        });
      }
      this.$emit("setComponentProps", key, newValue[key]);
    });
  },
  unmounted() {
    eventBus.off("canvasEdit")
  }
};
</script>

<style>
.properties-warpper {
  margin: 10px;
}
.properties-warpper-card .antv-form-item-control-wrapper {
  width: 100% !important;
}
</style>
