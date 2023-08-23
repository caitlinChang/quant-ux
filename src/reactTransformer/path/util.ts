import { get } from "lodash";
import { ComponentWrapperType } from "../util/type";

export const getNodeList = (rootPath: string, widget: ComponentWrapperType) => {
  if (!rootPath) {
    return [widget];
  }
  const rootWidgetInfo = {
    id: widget.id,
    library: widget.library,
  };
  const widgetProps = widget.props;
  const reg = /\w+\[\d+\](\[1\])?/g;
  const arr = rootPath.match(reg) || [];
  const nodeList = arr
    .map((item, index) => {
      let _item = item;
      if (/\[\d+\]\[1\]/.test(item)) {
        _item = item.replace(/\[1\]/, "");
      }
      const _arr = [...arr];
      const r = _arr.slice(0, index);
      r.push(_item);
      const key = r.join(".");
      const value = get(widgetProps, key) || [];
      if (value.length === 1) {
        // 文本内容没有属性展示到侧边栏上
        return {
          component: "文本",
          props: {
            text: value,
          },
          rootPath: key,
        };
      } else {
        const [name, props] = value;
        return {
          ...rootWidgetInfo,
          component: name,
          props: props,
          rootPath: key,
        };
      }
    })
    .filter((i) => i);

  return [widget, ...nodeList];
};
