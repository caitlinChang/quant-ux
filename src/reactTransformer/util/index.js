import Vue from 'vue';
import VueWrapper from '../vueWrapper';
/**
 * 根据 react component 配置信息, 创建一个真实的DOM节点
 * @param {*} componentInfo 
 * @returns 一个真实的DOM节点
 */
export const createReactRootDom = (componentInfo) => {
  const container = document.createElement('div');
  const node = new Vue({
    el:container,
    render: h => h(VueWrapper,{
      props:{
        componentInfo:componentInfo
      }
    })
  }).$mount();
  return node.$el;
}