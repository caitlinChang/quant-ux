dojo： 道场
dojo 是个工具库
有 css
$new 是用来创建一个 vue 实例的, 这个实例并不挂载在任何现有的 dom 上，而是在调用 $new 方法的时候 返回一个 vue 实例；
DojoWidget 提供了一个 <class="home"> dom 节点，并提供了一些方法，把 $new 返回的实例挂载到这个 dom 节点上;

此外，dojo 还提供了一些基础的工具
lang —— hitch 用于将函数绑定在某些作用域上
Color —— 设置颜色的
win —— document.body

on —— 为指定的 dom 节点 添加事件监听器，
own(on(xx,xxx)), 是为了将所有的 dom 上的事件都统一管理在 _dojoListener 中；
tempOwn(this.xxx.on(xxx)) —— 这是给 vue 实例添加事件监听，tempOwn 也是为了将这些实例上的事件统一管理在 _dojoTempListener 中；




