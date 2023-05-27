enum TSType {
  ReactNode = "ReactNode", // 如果是 ReactNode，就认为这里可以从画布上拖拽元素潜入
  String = "string", // 如果是 String，就认为这里可以输入字符串
  Number = "number", // 如果是 Number，就认为这里可以输入数字
  EUNM = "enum", // 如果是 EUNM，就认为这里可以从下拉框中选择
}
