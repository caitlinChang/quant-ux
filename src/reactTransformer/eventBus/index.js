import EventEmitter from "events";
// 用于画布上的组件和右侧组件编辑面板的通信
const eventBus = new EventEmitter();

export default eventBus;
