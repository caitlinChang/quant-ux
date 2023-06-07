数据结构的处理

1. options: { label: string | React.Element, value: string }[]
   现在解析的 json 结构中, 这个类型变成了 OptionType[];

   ```tsx
   // 1. array 类型
   {
    type:{
        name:'array',
        item:{
            label:'string | React.Element',
            value: string;
            children:'array'
        }
    }
   }

   // 2.
   ```

---

针对不同的 React 类型应该怎么处理：

1. ReactNode 是一个联合类型，它可以是 string | number 也可以是一个 ReactElement

```tsx
type ReactNode =
  | ReactChild
  | ReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined;
```

2. ReactElement 类型定义是含有 props 和 type 的对象；可以理解为 React 元素、一串 html,

```tsx
interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> =
    | string
    | JSXElementConstructor<any>
> {
  type: T;
  props: P;
  key: Key | null;
}

// eg1. <div>This is string.</div>
//
```

3. Component: React 组件， 它返回一个 ReactElement;

```tsx
// 这是一个 Component, 它返回一个 ReactElement;
function Test() {
  return <div>This is string </div>;
}
```

4. JSX.Element 通过执行 React.createElement 或是转译 JSX 获得，在 React 中，JSX.Element 就相当于 ReactElement;

```tsx
namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
}
```
