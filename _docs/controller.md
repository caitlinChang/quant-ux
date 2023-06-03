controller 对数据模型的操作；
baseController 维护的对整个 model 的操作；

widget 中维护了对 wiget 的操作，add、delete、update 等等；

addWidget/addComponent


addComponent 的操作，就是在 model 中添加对应的 widget数据，然后通过 commitModelChange 触发渲染；
这个时候依然只是对数据的操作，不涉及 dom；

commitModelChange 调用 Render.vue 中的 render 事件