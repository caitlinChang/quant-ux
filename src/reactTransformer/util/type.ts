import { StandardArrayItemType } from "./getFieldNames";

export enum TypeName {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Array = "array",
  Object = "object",
  Choice = "choice", // enum 多选或者单选，值为 string | string[]
  Children = "children", // 类型为children 代表和父类型一致
  ReactNode = "ReactNode",
  ReactChild = "ReactChild", // ReactChild 是 ReactNode 的子集，只能是一个 ReactElement
  ColorPicker = "ColorPicker", // 专用的颜色选择器
  CSSProperties = "CSSProperties", // 组件的style 属性， 在 Design 面板编辑
  Key = "Key", // 数据源的 value/key，需要mock 但不会在侧边栏上展示出来
  Import = "import", // 该组件的某个属性类型是另一个组件的props
  // ICON = "ICON", // TODO：ICON 可以与 ReactNode 合成一个吗？？？
}

export const typeNameList = [
  TypeName.String,
  TypeName.Number,
  TypeName.Boolean,
  TypeName.Array,
  TypeName.Object,
  TypeName.Children,
  TypeName.ReactNode,
  TypeName.Choice,
  // TypeName.ICON,
  TypeName.Key,
  TypeName.ColorPicker,
  TypeName.ReactChild,
  TypeName.Import,
  TypeName.CSSProperties,
];

// 定义前后端协议 propsConfig是每个配置项的信息，包括类型和默认值等等
export type ObjectItemType = {
  name: TypeName;
  importComponentName?: string;
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
  mockData?: any; // mock数据, 配置文件里配置的 mock 数据
  expandPanel?: boolean; // 是否展开面板
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

export type ComponentInfoType = {
  _type: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  component: string;
  props: any;
  componentPath: string;
  framework: "vue" | "react";
  library: "antd" | "antdIcon";
};

export type ComponentWrapperType = {
  id?: string;
  path?: string;
  component: string;
  library?: "antd" | "antdIcon";
  props: any;
};