类型解析文档：

```jsx
function SomeComponent(props: {
  a: string /** 名称 */,
  b: number /** 数值 */,
  c: boolean /** 开关 */,
  d: OptionType[], // 数据，需要在属性面板上做一定处理，自增、编辑等等
  e: "x" | "y" | "z", // enum
  f: CSSProperties, // 一般用于设置 style
  g: number | "responsive", // union, 普通类型组成的 union，拆开展示
  h: ReactNode | ((omittedValues: DisplayValueType[]) => ReactNode), // ReactNode 组成的union， 渲染成请填充组件，但面板不展示
  i: () => void, // event，不处理
  j: ReactNode, // 渲染成请填充组件，但面板不展示
}) {
  return <div>xxx</div>;
}
```

总结下来：
哪些是展示到属性面板上的，必须以下条件都满足

1. description 有值
2. 类型为上述 a、b c d e g 这种的

哪些是要需要在画布上渲染成插槽的，ReactNode, ReactElement, 或者 description 中添加标记？（这个要更严谨一点！！！）
如果属性名为 value，并且 props 中存在 onChange 属性，就认为是受控组件，这个时候 value 也可以在属性面板上编辑，也可以在画布上编辑。

```json
// 理想的解析结果
{
  "defaultValue": null,
  "description": "xxx", // description 是通过 JSDoc 解析而来， 如果为空的话就会略过
  "required": false,
  "type": {
    "name": "string", // "number" "enum" "union" "function" "ReactNode" "array" "object"
    "item": {
      "title": "reactNode",
      "dataIndex": "string",
      "children": "" // 怎么标记循环类型
    }, // "string" "number" "object" "array", 应该是一个嵌套的类型，比如 table 中的 columns, 那就一直嵌套好了，注意循环类型的处理
    "properties": {}
  }
}
```

```json
{
  "props": {
    "a": {
      "defaultValue": null,
      "description": "xxx", // description 是通过 JSDoc 解析而来， 如果为空的话就会略过
      "required": false,
      "type": {
        "name": "string"
      }
    },
    "b": {
      "type": {
        "name": "number"
      }
    },
    "c": {
      "type": {
        "name": "boolean"
      }
    },
    "d": {
      "type": {
        // "name": "OptionType[]"
        "name": "array",
        "item": {
          "label": "ReactNode",
          "value": "string"
        }
      }
    },
    "e": {
      "type": {
        "name": "\"x\" | \"y\" | \"z\""
      }
    },
    "f": {
      "type": {
        "name": "CSSProperties"
      }
    },
    "g": {
      "type": {
        "name": "number | \"responsive\""
      }
    },
    "h": {
      "type": {
        "name": "ReactNode | ((omittedValues: DisplayValueType[]) => ReactNode)"
      }
    },
    "i": {
      "type": {
        "name": "() => void"
      }
    },
    "j": {
      "type": {
        "name": "ReactNode"
      }
    }
  }
}
```

### 属性面板提供哪些支持性组件

1. 选项自增组件
   【检测到属性是 Array 类型就匹配自增组件】

- ArrayItem 是基本类型 【少见，暂不支持】
- ArrayItem 是 object【常见, 比如 select，radioGroup, buttonGroup 等等, 非嵌套】
  单层级的 ArrayItem
