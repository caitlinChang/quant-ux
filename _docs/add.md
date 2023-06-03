用于处理 画布上的各种 add 事件；
以添加 widget 为例：
addThemeComponent -> _addComponent(得到组件的 dom 结构) -> _onAddNDropStart(在 dndContainer 添加 dom, 添加 body 上的mousemove、mouseup、mousedown事件，用于更新 dom位置) -> _onAddDon（清除一系列事件，删除dom, 初始化各种add status）-> onComponentAdded（画布上添加组件成功之后触发的事件） -> this.controll.addComponent -> onComponentSelected

