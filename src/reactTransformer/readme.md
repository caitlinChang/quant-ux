现在画布的数据模型是这样的
model
 |__ screenCount
 |__ screenSize
 |__ startScreen
 |__ screens
        |__ children -> widgetID[]
        |__ x,y,z,w,h 位置、大小信息
        |__ id
        |__ name
        |__ style
        |__ props
        |__ isZoomed
 |__ widgetCount
 |__ widgets
        |__ widgetID -> widgetData
                        |__ x,y,z,w,h 位置、大小信息
                        |__ isZoomed 是否被缩放
                        |__ name 
                        |__ props
                        |__ created
                        |__ modified
                        |__ id
 |__ groups
 |__ templates
 |__ lines
 |__ grid
 |__ id
 |__ inherited
 |__ isDirty
 |__ lastBackup
 |__ lastCategory
 |__ lastUpdate

widgets 存储的是组件的数据模型；

props 面板向组件更新数据时，它会去更新 widget，更新完 widget 然后通过 eventBus 更新到对应的组件？如果是这样的流程的话，画布上的widget的数据来源应该就是 widgets, 而不是初始的component 了；

这个时候的数据变化流程应该是这样的；

widget 面板选中 widget，触发一系列 dnd 操作，在画布上添加一个 dnd box, 再添加一个 widget，然后通过 mounse 

 

