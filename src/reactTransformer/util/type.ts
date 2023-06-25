import { StandardArrayItemType } from "./getFieldNames";

export type TypeName =
  | "ReactNode"
  | "string"
  | "number"
  | "boolean"
  | "array"
  | "ICON";

// 定义前后端协议 propsConfig是每个配置项的信息，包括类型和默认值等等
export type PropItemConfigType = {
  name: string;
  description: string;
  type: {
    name: TypeName;
    item?: any;
  };
  needMock?: boolean; // 是否需要mock数据去填充
  controlledEvent?: boolean;
  controlledState?: boolean;
  valuePath?: string;
};

// 定义解析propsConfig后的类型，是前端渲染 propertiesPanel 和 渲染到画布时要处理的数据类型
export type RenderConfigType = {
  type: TypeName;
  fieldNames?: StandardArrayItemType[]; // array 类型才会有这个字段
  component?: string;
  decorator?: {
    initialValue?: any;
  };
  props?: any;
} | null;

// 这里的string 是一个 componentName
export type ReactNodeProp =
  | [string]
  | [
      string,
      {
        [key: string]: any;
      }
    ];
