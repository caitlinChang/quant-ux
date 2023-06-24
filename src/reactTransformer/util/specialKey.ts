// 这里根据一些特殊的key来做一些特殊的处理
// 一般情况下都是根据props的类型做
export enum SpecialKey {
  DISABLED = "disabled", // 会设置成 false，但是可以在右键菜单中设置为true or false
  ICON = "icon", // 会填充一个 ICON
}
