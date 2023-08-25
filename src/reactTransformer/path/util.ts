import { get, isArray } from "lodash";
import { ComponentWrapperType } from "../util/type";

export const getNodeList = (path: string, widget: ComponentWrapperType) => {
  if (!path) {
    return [widget];
  }
  const rootWidgetInfo = {
    id: widget.id,
    library: widget.library,
  };
  const widgetProps = widget.props;
  const reg = /\w+\[\d+\](\[1\])?/g;
  const arr = path.match(reg) || [];
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
      // TODO: 这里的判断并不完全正确，还是应该判断这个这里的key 是不是一个 ReactNode/ReactChild 类型的属性才行
      if (isArray(value)) {
        if (value.length === 1) {
          // 文本内容没有属性展示到侧边栏上
          return {
            component: "文本",
            props: {
              text: value,
            },
            path: key,
          };
        } else {
          const [name, props] = value;
          return {
            ...rootWidgetInfo,
            component: name,
            props: props,
            path: key,
          };
        }
      } else {
        return undefined;
      }
    })
    .filter((i) => i);

  return [widget, ...nodeList];
};
