### 通信

toolbar 和 canvas 之间怎么进行通信

应该是通过 controller 进行通信；

在 Design.vue 中，通过 ref 取到 toolbar 和 canvas 的实例;
Design.vue 中初始化 controller、service、factory，通过调用 toolbar、canvas、controller 的 set 方法，将各自的实例挂载到其他实例上，以便相互调用方法；

所以在代码中经常可以看到 this.toolbar.xxx 或者 this.canvas.xxx 、this.controller.xxx 这样的调用方式；

所以 Toolbar 中的面板发生变化的时候，只要调用 this.controller.updateWidget，后面的一系列更新就交给 controller 去通知 canvas 了；

### Toolbar 内部的通信

Toolbar 内部，是怎么控制属性面板打开、隐藏、展示什么数据的。
