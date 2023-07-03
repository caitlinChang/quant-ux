import { StandardArrayItemType } from "./getFieldNames";

export enum TypeName {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Array = "array",
  Object = "object",
  Children = "children", // 类型为children 代表和父类型一致
  ReactNode = "ReactNode",
  Choice = "choice", // enum 多选或者单选，值为 string | string[]
  ICON = "ICON", // TODO：ICON 可以与 ReactNode 合成一个吗？？？
}

// 定义前后端协议 propsConfig是每个配置项的信息，包括类型和默认值等等
export type ObjectItemType = {
  name: TypeName;
  item?: {
    [key: string]: PropItemConfigType;
  };
  property?: {
    [key: string]: PropItemConfigType;
  };
  enum?: string[];
};
export type PropItemConfigType = {
  name: string;
  type: ObjectItemType;
  description?: string;
  defaultValue?: any;
  needMock?: boolean; // 是否需要mock数据去填充
  required?: boolean;
  controlledState?: boolean;
  controlledEvent?: boolean; //TODO：弃用
  valuePath?: string; //TODO：弃用
};

// 定义解析propsConfig后的类型，是前端渲染 propertiesPanel 和 渲染到画布时要处理的数据类型
// TODO: 弃用
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

