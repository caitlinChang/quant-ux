无限画布

画布上有两种元素，分别是 screens 和 widgets；它们的 x,y 坐标,是相对于整个画布的；widgets 还会有 z 坐标；同时 widgets 又会组成 **groups**，还有 **lines**,用于对齐；


### container
整个画布是一个 container，画布可以放大缩小；在画布放大缩小的同时，screens 和 widgets 都会相应的放大缩小；
实现原理应该是，container 有一个初始的很大的 w,h;

zoom 为 100% 时， container 的 w\h = 40000px \ 20000px；画布的移动通过 transform: translate(mpx, npx)，来实现 应该是通过监听 mousemove 事件，通过 mousemove 的鼠标信息来计算 m\n;

zoom 变化时, container 的 w\h m\n 都会在相应的变化；

### zoomContainer & dndContainer
container 下有两个同级的 zoomContainer 和 dndContainer

#### zoomContainer
zoomContainer 是真正的渲染元素的 container, 在执行 zoomIn 和 zoomOut 的操作时，它的 transform: scale(0.94); 在变化；

zoomContainer 又分为 widgetContainer 和 screenContainer;真实的 screen 元素和 widget 元素都在 screenContainer 中;


#### dndContainer
dndContainer 和 container 一样大；画布上的元素，无论是 screen 还是 widgets，都会有一个对应的 dnd box, 用于处理 dnd 事件；这个 dnd box 相当于是 真正的元素的遮罩层；

在 dndContainer 中有一个 svg 元素，不清楚这个 svg 元素的作用, 可能是为了给画布上添加一写对 svg 元素的编辑能力吧；


### 画布上的元素
Screen

Widget

Line


### 核心流程的解释

##### 画布上元素的拖拽
触发 DndContainer 的 mousedown 事件(wiring中), 判断 e.target._WidgetID 存在，就调用 dispatchMousedownWidget 事件。
dispatchMousedownWidget 有两个走向，或者是开始拖拽，或者是双击进入编辑态；
如果是拖拽行为
```
this.onDragStart(div, widget.id, "onWidgetDndStart", "onWidgetDndMove", "onWidgetDndEnd", "onWidgetDndClick", e);
```